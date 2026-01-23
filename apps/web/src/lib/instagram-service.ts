import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

const IG_API_URL = "https://graph.instagram.com/v21.0";

export async function processInstagramEvent(body: any, signature: string | null) {
    // 1. Log basics
    const object = body.object;
    if (object !== "instagram" && object !== "page") {
        return;
    }

    // 2. Iterate entries
    for (const entry of body.entry) {
        const platformEventId = entry.id; // Usually the account ID or similar
        const messaging = entry.messaging || entry.changes; // 'messaging' for DMs, 'changes' for comments

        if (!messaging) continue;

        for (const event of messaging) {
            // Handle DM
            if (event.message) {
                await handleDmEvent(entry.id, event);
            }
            // Handle Comments
            if (event.field === 'comments') {
                await handleCommentEvent(entry.id, event);
            }
        }
    }
}

async function handleCommentEvent(accountId: string, event: any) {
    const value = event.value;
    const fromId = value.from.id; // User who successfully commented
    const mediaId = value.media.id; // The Post ID
    const commentId = value.id;
    const text = value.text || "";

    // If it's the page itself commenting, ignore usually?
    // But we might want to reply to our own comments in some weird cases? No, usually ignore self.
    // We don't have easy way to know self ID here unless we query DB.
    // But handleDmEvent checks echoes. Comment webhook doesn't have is_echo.
    // We'll rely on workflow match.

    console.log(`[IG Service] Handling Comment. mediaId=${mediaId}, text="${text}"`);

    // 1. Find Connected Account (Page)
    // entry.id is the Instagram Account ID of the page receiving the comment
    let account = await prisma.instagramAccount.findFirst({
        where: { igUserId: accountId },
        include: { workspace: true }
    });

    if (!account) {
        console.warn(`[IG Service] Account not found for comment entryId: ${accountId}`);
        return;
    }

    // 2. Log Webhook Event
    const webhookEvent = await prisma.webhookEvent.create({
        data: {
            workspaceId: account.workspaceId,
            platform: "INSTAGRAM",
            eventType: "FEED_COMMENT",
            platformEventId: commentId,
            payloadJson: event,
            signatureValid: true,
            processingStatus: "PROCESSING"
        }
    });

    // 3. Find Workflows
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

    // 4. Match
    for (const workflow of workflows) {
        const trigger = workflow.triggers.find(t => t.type === "FEED_COMMENT");
        if (!trigger) continue;

        const config = trigger.configJson as any;
        const keywords = config.keywords;
        const matchMode = config.matchMode || "contains";
        const targetPosts = config.posts || []; // array of strings (media IDs)

        // Post Match
        // If targetPosts is not empty, we MUST match one of them.
        // If empty, we match ALL posts.
        if (targetPosts.length > 0) {
            if (!targetPosts.includes(mediaId)) {
                continue; // Not the right post
            }
        }

        // Keyword Match
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
            // Execute Actions
            // For comments, we usually use DM reply or Comment reply.
            // Our current runWorkflowActions supports SEND_DM.
            // If the user configures "Responder no Direct", it uses SEND_DM.
            // We pass fromId as recipientId.
            // IMPORTANT: To send DM to a commenter, we need "Private Replies" capability or just Send DM.
            // Standard Send DM might fail if user didn't message us first (24h window).
            // BUT "Private Replies" to comments is a specific API: POST /me/messages with recipient: { comment_id: ... }
            // Let's see if runWorkflowActions needs adjustment.

            await runWorkflowActions(workflow, account, fromId, webhookEvent.id, commentId);
        }
    }

    // Update status
    await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { processingStatus: "DONE", processedAt: new Date() }
    });
}

async function handleDmEvent(accountId: string, event: any) {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const message = event.message;

    if (message.is_echo) return; // Ignore echoes

    const text = message.text || "";

    const isStoryReply = !!(event.message.reply_to && event.message.reply_to.story);
    const targetTriggerType = isStoryReply ? "STORY_REPLY" : "DM_RECEIVED";

    console.log(`[IG Service] Handling DM. isStoryReply=${isStoryReply}, targetTriggerType=${targetTriggerType}, text="${text}"`);

    // 1. Find the connected account (Recipient)
    // igUserId should match recipientId
    let account = await prisma.instagramAccount.findFirst({
        where: { igUserId: recipientId },
        include: { workspace: true }
    });

    if (!account) {
        console.warn(`[IG Service] Account not found directly for recipientId: ${recipientId}. Attempting resolution via tokens...`);

        // Self-Healing: Try to find which account this ID belongs to by checking tokens
        const allAccounts = await prisma.instagramAccount.findMany({
            where: { status: 'CONNECTED' }
        });

        let foundAccount = null;

        for (const acc of allAccounts) {
            try {
                const token = decrypt(acc.accessTokenEncrypted);
                // Try to fetch the recipientId node using this token
                // We try both endpoints just in case, but usually graph.instagram.com for IG Login tokens
                const checkUrl = `https://graph.instagram.com/v21.0/${recipientId}?fields=id,username&access_token=${token}`;

                const res = await fetch(checkUrl);
                if (res.ok) {
                    const data = await res.json();
                    if (data.username === acc.username) {
                        console.log(`[IG Service] ID Mismatch Resolved! stored=${acc.igUserId}, incoming=${recipientId}. Updating DB...`);

                        // Update DB with the correct "Webhook-compatible" ID
                        foundAccount = await prisma.instagramAccount.update({
                            where: { id: acc.id },
                            data: { igUserId: recipientId }
                        });

                        // Re-fetch with workspace
                        foundAccount = await prisma.instagramAccount.findUnique({
                            where: { id: acc.id },
                            include: { workspace: true }
                        });
                        break;
                    }
                }
            } catch (ignore) { }
        }

        if (!foundAccount) {
            console.error(`[IG Service] Failed to resolve account for recipientId: ${recipientId}`);
            // DEBUG:
            console.log("ALL AVAILABLE ACCOUNTS (Failed resolution):", JSON.stringify(allAccounts.map(a => ({ id: a.id, igUserId: a.igUserId, username: a.username }))));
            return;
        }

        // Use the resolved account
        // @ts-ignore
        account = foundAccount;
    }

    if (!account) return;

    // 2. Log Webhook Event
    const webhookEvent = await prisma.webhookEvent.create({
        data: {
            workspaceId: account.workspaceId,
            platform: "INSTAGRAM",
            eventType: isStoryReply ? "STORY_REPLY" : "DM_RECEIVED",
            platformEventId: event.mid || `dm_${Date.now()}_${Math.random()}`, // Message ID
            payloadJson: event,
            signatureValid: true, // We assume validated in route
            processingStatus: "PROCESSING"
        }
    });

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

    // 4. Match Triggers
    for (const workflow of workflows) {
        const trigger = workflow.triggers.find(t => t.type === targetTriggerType);
        if (!trigger) continue;

        const config = trigger.configJson as any;
        const keywords = config.keywords; // string[]
        const matchMode = config.matchMode || "contains";

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
            await runWorkflowActions(workflow, account, senderId, webhookEvent.id);
        }
    }

    // Update status
    await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { processingStatus: "DONE", processedAt: new Date() }
    });
}

async function runWorkflowActions(workflow: any, account: any, recipientId: string, webhookEventId: string, commentId?: string) {
    // Log Run
    const run = await prisma.automationRun.create({
        data: {
            workflowId: workflow.id,
            webhookEventId: webhookEventId,
            status: "RUNNING"
        }
    });

    try {
        for (const action of workflow.actions) {
            if (action.type === "SEND_DM" || action.type === "REPLY_COMMENT") {
                const config = action.configJson as any;

                // 1. Send DM (Private Reply if commentId exists)
                // Always send if replyMessage is present (User expectation: "DM message")
                const replyText = config.replyMessage;
                const cta = (config.cta && config.cta.enabled && config.cta.text && config.cta.url)
                    ? { text: config.cta.text, url: config.cta.url }
                    : undefined;

                if (replyText) {
                    if (commentId) {
                        try {
                            await sendPrivateReply(account, commentId, replyText, cta);
                        } catch (e: any) {
                            // Fallback? If Private Reply fails, maybe try standard DM? 
                            // But usually strict 7 day window applies to Private Reply, and 24h to standard.
                            // If Private fails, standard likely fails too unless recently interacted.
                            console.error("Private Reply failed, attempting standard DM fallback", e);
                            await sendDm(account, recipientId, replyText, cta);
                        }
                    } else {
                        await sendDm(account, recipientId, replyText, cta);
                    }
                }

                // 2. Public Comment Reply (Optional)
                if (commentId && config.enableCommentReply && config.commentReplyMessage) {
                    await replyToComment(account, commentId, config.commentReplyMessage);
                }
            }
        }

        await prisma.automationRun.update({
            where: { id: run.id },
            data: { status: "SUCCESS", finishedAt: new Date() }
        });
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

async function sendDm(account: any, recipientId: string, text: string, cta?: { text: string, url: string }) {
    let accessToken = decrypt(account.accessTokenEncrypted).trim();

    console.log(`[IG Service] Sending DM to ${recipientId} (Has CTA: ${!!cta})...`);

    const url = `${IG_API_URL}/me/messages?access_token=${accessToken}`;

    let body;

    if (cta) {
        body = {
            recipient: { id: recipientId },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text, // Button template text (max 640 chars)
                        buttons: [
                            {
                                type: "web_url",
                                url: cta.url,
                                title: cta.text
                            }
                        ]
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

async function sendPrivateReply(account: any, commentId: string, text: string, cta?: { text: string, url: string }) {
    let accessToken = decrypt(account.accessTokenEncrypted).trim();

    console.log(`[IG Service] Sending Private Reply to Comment ${commentId} (Has CTA: ${!!cta})...`);

    const url = `${IG_API_URL}/me/messages?access_token=${accessToken}`;

    let body;

    if (cta) {
        // Attempting Button Template for Private Reply
        // Note: If this fails, we might need to fallback to text only.
        // Instagram documentation is sparse on Private Reply attachment support.
        // But generally, it mimics the messaging API.
        body = {
            recipient: { comment_id: commentId },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text,
                        buttons: [
                            {
                                type: "web_url",
                                url: cta.url,
                                title: cta.text
                            }
                        ]
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

