import { prisma } from "./prisma";
import { decrypt } from "./encryption";

const IG_API_URL = "https://graph.instagram.com/v21.0";

// NEW: Queue Job Handler or Inline Processor
export async function handleWebhookJob(eventId: string, payloadOverride?: any) {
    let body;
    // We treat everything as "inline" in terms of not needing to update status if it was just passed in raw,
    // BUT now we ensure we have a valid DB ID for the FK constraint.
    let isInline = false;

    if (payloadOverride) {
        body = payloadOverride;
        isInline = true;
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
    // Create a real event record to satisfy AutomationRun foreign key
    try {
        const event = await prisma.webhookEvent.create({
            data: {
                platform: 'INSTAGRAM',
                eventType: 'WEBHOOK_POST',
                platformEventId: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                payloadJson: body,
                signatureValid: true, // In production, verify this!
                processingStatus: 'PROCESSING'
            }
        });

        console.log(`[IG Service] Created WebhookEvent ${event.id} for processing.`);
        await handleWebhookJob(event.id);

    } catch (e) {
        console.error("Failed to persist webhook event, fallback to inline (might fail FK)", e);
        await handleWebhookJob("inline-fallback-" + Date.now(), body);
    }
}

// --- Helper: Fetch Public Profile ---
async function fetchUserProfile(accessToken: string, userId: string) {
    try {
        // Try getting public info (name, username, pic)
        const url = `https://graph.facebook.com/v21.0/${userId}?fields=id,name,username,profile_picture_url&access_token=${accessToken}`;
        const res = await fetch(url);
        const data = await res.json();
        return data.error ? null : data;
    } catch (e) {
        console.error("Error fetching user profile", e);
        return null;
    }
}

// --- Helper: Upsert Contact ---
async function upsertContact(account: any, instagramId: string, usernameFallback?: string) {
    try {
        const existing = await prisma.contact.findUnique({
            where: {
                workspaceId_instagramId: {
                    workspaceId: account.workspaceId,
                    instagramId: instagramId
                }
            }
        });

        if (existing) {
            return await prisma.contact.update({
                where: { id: existing.id },
                data: { lastInteraction: new Date() }
            });
        }

        // 2. Fetch Profile Details for New Contact
        let fullName = usernameFallback || `User ${instagramId}`;
        let username = usernameFallback || null;
        let profilePicUrl = null;

        if (account.accessTokenEncrypted) {
            const token = decrypt(account.accessTokenEncrypted).trim();
            const profile = await fetchUserProfile(token, instagramId);

            if (profile) {
                fullName = profile.name || profile.username || fullName;
                username = profile.username || username; // profile.username matches schema field
                profilePicUrl = profile.profile_picture_url || null;
            }
        }

        // 3. Create
        return await prisma.contact.create({
            data: {
                workspaceId: account.workspaceId,
                instagramId: instagramId,
                fullName: fullName,
                username: username,
                profilePicUrl: profilePicUrl,
                tags: [],
                lastInteraction: new Date()
            }
        });
    } catch (e) {
        console.error("Error upserting contact", e);
        // Fallback or ignore
    }
}

// --- Helper: Find Account safely ---
async function findAccountByInstagramId(targetId: string) {
    // 1. Direct Lookup
    let account = await prisma.instagramAccount.findFirst({
        where: { igUserId: targetId },
        include: { workspace: true }
    });

    if (account) return account;

    console.warn(`[IG Service] Account not found directly for ID: ${targetId}. Attempting resolution via tokens...`);

    // 2. Self-Healing Search
    const allAccounts = await prisma.instagramAccount.findMany({
        where: { status: 'CONNECTED' }
    });

    for (const acc of allAccounts) {
        try {
            // Skip if no token
            if (!acc.accessTokenEncrypted) continue;

            const token = decrypt(acc.accessTokenEncrypted).trim();

            let checkUrl = `https://graph.instagram.com/v21.0/${targetId}?fields=id,username&access_token=${token}`;
            let res = await fetch(checkUrl);
            let data = await res.json();

            if (!res.ok) {
                checkUrl = `https://graph.facebook.com/v21.0/${targetId}?fields=id,username&access_token=${token}`;
                res = await fetch(checkUrl);
                data = await res.json();
            }

            if (res.ok && data.username) {
                if (data.username.toLowerCase() === acc.username.toLowerCase()) {
                    console.log(`[IG Service] ✅ Match found! Token for ${acc.username} resolved ${targetId}. Updating DB...`);

                    return await prisma.instagramAccount.update({
                        where: { id: acc.id },
                        data: {
                            igUserId: targetId,
                            username: data.username
                        },
                        include: { workspace: true }
                    });
                }
            }
        } catch (e) {
            console.error("Error in account resolution loop", e);
        }
    }
    return null;
}

// --- Helper: Handle Comment Event ---
async function handleCommentEvent(accountId: string, change: any, eventId?: string) {
    console.log(`[IG Service] Handling Comment Event for Account ${accountId}`);

    const value = change.value;
    const mediaId = value.media.id;
    const text = value.text;
    const commentId = value.id;
    const fromId = value.from.id;
    const fromUsername = value.from.username;

    if (fromId === accountId) return;

    const account = await findAccountByInstagramId(accountId);

    if (!account) {
        console.warn(`[IG Service] CRITICAL: Account not found for comment. Account ID: ${accountId}`);
        return;
    }

    await upsertContact(account, fromId, fromUsername);

    const workflows = await prisma.workflow.findMany({
        where: {
            workspaceId: account.workspaceId,
            isActive: true,
            status: "PUBLISHED",
            triggers: {
                some: {
                    type: "FEED_COMMENT"
                }
            }
        },
        include: {
            triggers: true,
            actions: true
        }
    });

    console.log(`[IG Service] Found ${workflows.length} workflows for FEED_COMMENT`);

    for (const workflow of workflows) {
        const trigger = workflow.triggers.find(t => t.type === 'FEED_COMMENT');
        if (!trigger) continue;

        const config = trigger.configJson as any;

        if (config.targetMediaId && config.targetMediaId !== mediaId) {
            continue;
        }

        const keywords = config.keywords || [];
        const matchMode = config.matchMode || 'contains';
        let matched = false;

        if (keywords.length === 0) {
            matched = true;
        } else {
            const lowerText = text.toLowerCase();
            if (matchMode === 'exact') {
                matched = keywords.some((k: string) => k.toLowerCase().trim() === lowerText);
            } else {
                matched = keywords.some((k: string) => lowerText.includes(k.toLowerCase().trim()));
            }
        }

        if (matched) {
            console.log(`[IG Service] Workflow ${workflow.title} MATCHED! Executing...`);
            await runWorkflowActions(workflow, account, fromId, eventId || 'inline', commentId);
        }
    }
}

async function handleDmEvent(accountId: string, event: any, eventId?: string) {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const message = event.message;

    if (message.is_echo) return;

    const text = message.text || "";
    const isStoryReply = !!(event.message.reply_to && event.message.reply_to.story);
    const targetTriggerType = isStoryReply ? "STORY_REPLY" : "DM_RECEIVED";

    console.log(`[IG Service] Handling DM. isStoryReply=${isStoryReply}, targetTriggerType=${targetTriggerType}, text="${text}"`);

    const account = await findAccountByInstagramId(recipientId);

    if (!account) {
        console.error(`[IG Service] STOP: No account found for DM. Recipient: ${recipientId}`);
        return;
    }

    console.log(`[IG Service] Account identified: ${account.username} (ID: ${account.igUserId})`);

    await upsertContact(account, senderId);

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

    for (const workflow of workflows) {
        const trigger = workflow.triggers.find(t => t.type === targetTriggerType);
        if (!trigger) continue;

        const config = trigger.configJson as any;
        const keywords = config.keywords;
        const matchMode = config.matchMode || "contains";

        let matched = false;

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
            await runWorkflowActions(workflow, account, senderId, eventId || 'temporary-id');
        }
    }
}

async function runWorkflowActions(workflow: any, account: any, recipientId: string, webhookEventId: string, commentId?: string) {
    let validEventId = webhookEventId;

    const isInline = webhookEventId.startsWith('inline-');
    if (isInline) {
        try {
            // Try creating a dummy event if needed to satisfy FK
            // Note: Ideally we pass the real event ID from processInstagramEvent
            /* 
            const dummy = await prisma.webhookEvent.create({ ... });
            validEventId = dummy.id; 
            */
            // Assuming now processInstagramEvent handles creation properly before calling job
        } catch (e) {
            console.error("Failed handling inline event ID", e);
        }
    }

    // Try/Catch creation to be safe vs FK constraint
    let run;
    try {
        run = await prisma.automationRun.create({
            data: {
                workflowId: workflow.id,
                webhookEventId: validEventId,
                status: "RUNNING"
            }
        });
    } catch (e: any) {
        console.error("Error creating AutomationRun (likely invalid webhookEventId FK)", e);
        // If we fail specifically on FK, we might want to try creating a dummy event?
        // But for now, just log and abort execution to prevent crash loop.
        return;
    }

    try {
        console.log(`[IG Service] Starting Graph Execution for workflow: ${workflow.title}`);

        const flow = workflow.flowDefinition as any;
        if (!flow || !flow.nodes) throw new Error("Flow definition missing");

        const triggerNode = flow.nodes.find((n: any) =>
            n.type === 'trigger' || n.type === 'trigger_comment' || n.type === 'trigger_mention'
        );

        if (triggerNode) {
            await executeWorkflowNode(workflow, account, recipientId, triggerNode.id, run.id, commentId || null);
        }

    } catch (e: any) {
        console.error("Error executing workflow", e);
        if (run) {
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
                    fullName: `User ${recipientId}`,
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
        body = {
            recipient: { id: recipientId },
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
        body = {
            recipient: { id: recipientId },
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

    await executeWorkflowNode(workflow, account, data.senderId, data.nodeId, data.runId, data.commentId);
}
