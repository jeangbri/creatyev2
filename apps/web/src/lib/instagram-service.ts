import { prisma } from "./prisma";
import { decrypt } from "./encryption";

const IG_API_URL = "https://graph.instagram.com/v21.0";

// NEW: Queue Job Handler or Inline Processor
export async function handleWebhookJob(eventId: string, payloadOverride?: any) {
    let body;
    let isInline = eventId.startsWith('inline-');

    if (payloadOverride) {
        body = payloadOverride;
    } else {
        const event = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
        if (!event) return;
        body = event.payloadJson as any;
    }

    try {
        const object = body.object;
        if (object !== "instagram" && object !== "page") {
            return;
        }

        for (const entry of body.entry) {
            const messaging = entry.messaging || entry.changes;
            if (!messaging) continue;

            for (const change of messaging) {
                if (change.message) {
                    await handleDmEvent(entry.id, change, eventId);
                }
                if (change.field === 'comments') {
                    await handleCommentEvent(entry.id, change, eventId);
                }
            }
        }

        if (!isInline) {
            await prisma.webhookEvent.update({
                where: { id: eventId },
                data: { processingStatus: "DONE", processedAt: new Date() }
            });
        }
    } catch (e: any) {
        console.error("Error processing webhook event", e);
        if (!isInline) {
            await prisma.webhookEvent.update({
                where: { id: eventId },
                data: { processingStatus: "ERROR", lastError: e.message }
            });
        }
    }
}

export async function processInstagramEvent(body: any, signature: string | null) {
    // Legacy helper - redirects to job logic
    console.log("[IG Service] Processing event via processInstagramEvent proxy...");
    await handleWebhookJob("inline-proxy-" + Date.now(), body);
}

// ... upsertContact ...

// ... handleCommentEvent ...


async function handleDmEvent(accountId: string, event: any, eventId?: string) {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const message = event.message;

    if (message.is_echo) return; // Ignore echoes

    const text = message.text || "";
    const isStoryReply = !!(event.message.reply_to && event.message.reply_to.story);
    const targetTriggerType = isStoryReply ? "STORY_REPLY" : "DM_RECEIVED";

    console.log(`[IG Service] Handling DM. isStoryReply=${isStoryReply}, targetTriggerType=${targetTriggerType}, text="${text}"`);

    // 1. Find the connected account (Recipient)
    // igUserId should match recipientId (Business ID)
    let account = await prisma.instagramAccount.findFirst({
        where: { igUserId: recipientId },
        include: { workspace: true }
    });

    if (!account) {
        console.warn(`[IG Service] Account not found directly for recipientId: ${recipientId}. Attempting resolution via tokens...`);

        // Self-Healing
        const allAccounts = await prisma.instagramAccount.findMany({
            where: { status: 'CONNECTED' }
        });

        let foundAccount = null;

        for (const acc of allAccounts) {
            try {
                const token = decrypt(acc.accessTokenEncrypted).trim();

                // Strategy 1: Check via Instagram Graph API
                let checkUrl = `https://graph.instagram.com/v21.0/${recipientId}?fields=id,username&access_token=${token}`;
                let res = await fetch(checkUrl);
                let data = await res.json();

                if (!res.ok) {
                    // Strategy 2: Check via Facebook Graph API (in case ID is only valid there)
                    checkUrl = `https://graph.facebook.com/v21.0/${recipientId}?fields=id,username&access_token=${token}`;
                    res = await fetch(checkUrl);
                    data = await res.json();
                }

                if (res.ok && data.username) {
                    // We found the username associated with this mysterious ID using this token.
                    // Does it match the account's localized username?
                    // Or does it imply this token HAS access to this ID?

                    // IF the token successfully fetched the ID, it implies "Access".
                    // BUT we should verify if it's the SAME account to be safe.
                    // Compare usernames (case insensitive)
                    if (data.username.toLowerCase() === acc.username.toLowerCase()) {
                        console.log(`[IG Service] ✅ Match found! Token for ${acc.username} resolved ${recipientId}. Updating DB...`);

                        foundAccount = await prisma.instagramAccount.update({
                            where: { id: acc.id },
                            data: {
                                igUserId: recipientId, // Update to the Business ID
                                username: data.username // Sync username
                            }
                        });
                        break;
                    } else {
                        console.log(`[IG Service] ⚠️ Token for ${acc.username} can see ${recipientId} (${data.username}), but usernames mismatch. Ignoring.`);
                    }
                }
            } catch (ignore) {
                console.error("Error in loop", ignore);
            }
        }

        if (foundAccount) {
            // @ts-ignore
            account = await prisma.instagramAccount.findUnique({
                where: { id: foundAccount.id },
                include: { workspace: true }
            });
        }
    }

    if (!account) {
        console.error(`[IG Service] STOP: No account found for DM. Recipient: ${recipientId}`);
        return;
    }

    console.log(`[IG Service] Account identified: ${account.username} (ID: ${account.igUserId})`);

    // 2. Upsert Contact
    await upsertContact(account, senderId);

    // 3. Find Workflows
    const workflows = await prisma.workflow.findMany({
        where: {
            workspaceId: account.workspaceId,
            isActive: true,
            status: "PUBLISHED",
            triggers: {
                some: {
                    type: targetTriggerType
                }
            }
        },
        include: {
            triggers: true,
            actions: true
        }
    });

    console.log(`[IG Service] Found ${workflows.length} active workflows for ${targetTriggerType}`);

    // 4. Match Triggers
    for (const workflow of workflows) {
        const trigger = workflow.triggers.find(t => t.type === targetTriggerType);
        if (!trigger) {
            console.log(`[IG Service] Trigger of type ${targetTriggerType} not found in workflow ${workflow.title}`);
            continue;
        }

        const config = trigger.configJson as any;
        const keywords = config.keywords; // string[]
        const matchMode = config.matchMode || "contains";

        console.log(`[IG Service] Checking workflow "${workflow.title}". Keywords: ${JSON.stringify(keywords)}, Mode: ${matchMode}`);

        let matched = false;

        // If no keywords, match everything
        if (!keywords || keywords.length === 0) {
            matched = true;
        } else {
            const lowerText = text.toLowerCase();
            if (matchMode === "exact") {
                matched = keywords.some((k: string) => k.toLowerCase().trim() === lowerText);
            } else {
                matched = keywords.some((k: string) => lowerText.includes(k.toLowerCase().trim()));
            }
        }

        if (matched) {
            // Execute Actions
            await runWorkflowActions(workflow, account, senderId, eventId || 'temporary-id');
        }
    }

}


async function runWorkflowActions(workflow: any, account: any, recipientId: string, webhookEventId: string, commentId?: string) {
    const run = await prisma.automationRun.create({
        data: {
            workflowId: workflow.id,
            webhookEventId: webhookEventId,
            status: "RUNNING"
        }
    });

    try {
        console.log(`[IG Service] Starting Graph Execution for workflow: ${workflow.title}`);

        // Start from the trigger node that would have matched
        const flow = workflow.flowDefinition as any;
        if (!flow || !flow.nodes) throw new Error("Flow definition missing");

        // Simple: Find the trigger node to start from
        // Note: For now we just find any trigger node, but ideally we'd pass the specific ID
        const triggerNode = flow.nodes.find((n: any) =>
            n.type === 'trigger' || n.type === 'trigger_comment' || n.type === 'trigger_mention'
        );

        if (triggerNode) {
            await executeWorkflowNode(workflow, account, recipientId, triggerNode.id, run.id, commentId || null);
        }

    } catch (e: any) {
        console.error("Error executing workflow", e);
        await prisma.automationRun.update({
            where: { id: run.id },
            data: {
                status: "ERROR",
                finishedAt: new Date(),
                errorMessage: e.message
            }
        });
    }
}

async function executeWorkflowNode(workflow: any, account: any, recipientId: string, nodeId: string, runId: string, commentId: string | null) {
    const flow = workflow.flowDefinition as any;
    const edges = (flow.edges || []).filter((e: any) => e.source === nodeId);

    for (const edge of edges) {
        const nextNode = (flow.nodes || []).find((n: any) => n.id === edge.target);
        if (!nextNode) continue;

        console.log(`[IG Service] Executing ${nextNode.type} (${nextNode.id})`);

        if (nextNode.type === 'instagram') {
            const { content } = nextNode.data || {};
            const text = content?.message || '';
            const imageUrl = content?.imageUrl || '';
            const buttons = content?.buttons || [];

            if (commentId) {
                await sendPrivateReply(account, commentId, text, buttons, imageUrl);
            } else {
                await sendDm(account, recipientId, text, buttons, imageUrl);
            }
            await executeWorkflowNode(workflow, account, recipientId, nextNode.id, runId, commentId);
        }
        else if (nextNode.type === 'delay') {
            const { scheduleWorkflowResume } = require('./qstash');
            const { parseTimeToMs } = require('./utils');

            const timeStr = nextNode.data?.time || '1 minuto';
            const ms = parseTimeToMs(timeStr);
            const seconds = Math.ceil(ms / 1000);

            console.log(`[IG Service] ⏳ Scheduling QStash Delay. String="${timeStr}", Seconds=${seconds}. Job: resumeWorkflow`);

            await scheduleWorkflowResume(seconds, {
                workflowId: workflow.id,
                accountId: account.id,
                senderId: recipientId,
                nodeId: nextNode.id,
                runId,
                commentId
            });

            console.log(`[IG Service] ✅ Job Scheduled on QStash successfully.`);
            return;
        }
        else if (nextNode.type === 'tag') {
            const newTags = nextNode.data?.tags || [];
            const contact = await prisma.contact.findUnique({
                where: { workspaceId_instagramId: { workspaceId: account.workspaceId, instagramId: recipientId } }
            });

            const currentTags = contact?.tags || [];
            const updatedTags = Array.from(new Set([...currentTags, ...newTags]));

            await prisma.contact.upsert({
                where: { workspaceId_instagramId: { workspaceId: account.workspaceId, instagramId: recipientId } },
                create: {
                    workspaceId: account.workspaceId,
                    instagramId: recipientId,
                    tags: newTags,
                    lastInteraction: new Date()
                },
                update: { tags: { set: updatedTags } }
            });
            await executeWorkflowNode(workflow, account, recipientId, nextNode.id, runId, commentId);
        }
        else if (nextNode.type === 'condition') {
            const contact = await prisma.contact.findUnique({
                where: { workspaceId_instagramId: { workspaceId: account.workspaceId, instagramId: recipientId } }
            });

            const userTags = contact?.tags || [];
            const tagToCheck = nextNode.data?.tag || '';
            const matches = userTags.includes(tagToCheck);

            const handle = matches ? 'true' : 'false';
            const branchEdge = (flow.edges || []).find((e: any) => e.source === nextNode.id && e.sourceHandle === handle);
            if (branchEdge) {
                await executeWorkflowNode(workflow, account, recipientId, branchEdge.target, runId, commentId);
            }
            return;
        }
        else {
            await executeWorkflowNode(workflow, account, recipientId, nextNode.id, runId, commentId);
        }
    }

    if (edges.length === 0) {
        await prisma.automationRun.update({
            where: { id: runId },
            data: { status: "SUCCESS", finishedAt: new Date() }
        });
    }
}

async function sendDm(account: any, recipientId: string, text: string, buttons?: any[], imageUrl?: string) {
    let accessToken = decrypt(account.accessTokenEncrypted).trim();

    console.log(`[IG Service] Sending DM to ${recipientId}. Image: ${!!imageUrl}, Buttons: ${buttons?.length || 0}`);

    const url = `${IG_API_URL}/me/messages?access_token=${accessToken}`;

    let body;

    if (imageUrl) {
        // Generic Template for Image + Text + Buttons
        body = {
            recipient: { id: recipientId },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: text || " ", // Title is required for generic template
                                image_url: imageUrl,
                                buttons: buttons && buttons.length > 0 ? buttons.slice(0, 3).map(b => ({
                                    type: "web_url",
                                    url: b.url,
                                    title: b.label
                                })) : undefined
                            }
                        ]
                    }
                }
            }
        };
    } else if (buttons && buttons.length > 0) {
        body = {
            recipient: { id: recipientId },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text, // Button template text (max 640 chars)
                        buttons: buttons.map(b => ({
                            type: "web_url", // Currently strictly web_url based on UI
                            url: b.url,
                            title: b.label
                        }))
                    }
                }
            }
        };
    } else {
        body = {
            recipient: { id: recipientId },
            message: { text: text }
        };
    }

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();

    if (!res.ok) {
        console.error("[IG Service] DM Send Failed:", JSON.stringify(data));
        throw new Error(`Failed to send DM: ${JSON.stringify(data)}`);
    }
    return data;
}

async function sendPrivateReply(account: any, commentId: string, text: string, buttons?: any[], imageUrl?: string) {
    let accessToken = decrypt(account.accessTokenEncrypted).trim();

    console.log(`[IG Service] Sending Private Reply to Comment ${commentId}. Image: ${!!imageUrl}, Buttons: ${buttons?.length || 0}`);

    const url = `${IG_API_URL}/me/messages?access_token=${accessToken}`;

    let body;

    if (imageUrl) {
        body = {
            recipient: { comment_id: commentId },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                            {
                                title: text || " ",
                                image_url: imageUrl,
                                buttons: buttons && buttons.length > 0 ? buttons.slice(0, 3).map(b => ({
                                    type: "web_url",
                                    url: b.url,
                                    title: b.label
                                })) : undefined
                            }
                        ]
                    }
                }
            }
        };
    } else if (buttons && buttons.length > 0) {
        // Attempting Button Template for Private Reply
        body = {
            recipient: { comment_id: commentId },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text,
                        buttons: buttons.map(b => ({
                            type: "web_url",
                            url: b.url,
                            title: b.label
                        }))
                    }
                }
            }
        };
    } else {
        body = {
            recipient: { comment_id: commentId },
            message: { text: text }
        };
    }

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();

    if (!res.ok) {
        console.error("[IG Service] Private Reply Failed:", JSON.stringify(data));
        // If the error implies attachment not supported, we could retry with text only?
        // But for now, throw.
        throw new Error(`Failed to send Private Reply: ${JSON.stringify(data)}`);
    }
    return data;
}

async function replyToComment(account: any, commentId: string, text: string) {
    let accessToken = decrypt(account.accessTokenEncrypted).trim();

    console.log(`[IG Service] Public Reply to Comment ${commentId}.`);

    const url = `${IG_API_URL}/${commentId}/replies?access_token=${accessToken}`;

    const body = { message: text };

    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();

    if (!res.ok) {
        console.error("[IG Service] Public Comment Reply Failed:", JSON.stringify(data));
        throw new Error(`Failed to reply to comment: ${JSON.stringify(data)}`);
    }
    return data;
}

export async function resumeWorkflowFromJob(data: any) {
    console.log(`[Worker] Resuming workflow run ${data.runId} at node ${data.nodeId}`);

    // 1. Fetch Workflow & Account
    const workflow = await prisma.workflow.findUnique({
        where: { id: data.workflowId },
        include: { triggers: true, actions: true }
    });

    const account = await prisma.instagramAccount.findUnique({
        where: { id: data.accountId },
        include: { workspace: true }
    });

    if (!workflow || !account) {
        console.error("[Worker] Workflow or Account not found", data);
        await prisma.automationRun.update({
            where: { id: data.runId },
            data: { status: "ERROR", errorMessage: "Resuming failed: Context lost" }
        });
        return;
    }

    // 2. Call executeWorkflowNode
    await executeWorkflowNode(workflow, account, data.senderId, data.nodeId, data.runId, data.commentId);
}

