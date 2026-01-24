"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWebhookEvent = processWebhookEvent;
const db_1 = require("@repo/db");
const instagram_api_1 = require("./instagram-api");
const prisma = new db_1.PrismaClient();
async function processWebhookEvent(eventId) {
    const event = await prisma.webhookEvent.findUnique({
        where: { id: eventId }
    });
    if (!event)
        return;
    await prisma.webhookEvent.update({
        where: { id: eventId },
        data: { processingStatus: 'PROCESSING' }
    });
    try {
        const payload = event.payloadJson;
        // Iterate entries
        for (const entry of payload.entry || []) {
            const igUserId = entry.id; // The business account ID
            // Find Account
            // Note: igUserId in DB might be different if Connected via FB Page? 
            // Usually entry.id is the Instagram Business Account ID.
            const account = await prisma.instagramAccount.findFirst({
                where: { igUserId: String(igUserId) } // We assume we stored this ID
            });
            if (!account) {
                console.log(`No account found for IG User ID: ${igUserId}`);
                continue;
            }
            // Handle Messaging (DMs & Story Replies)
            if (entry.messaging) {
                for (const msg of entry.messaging) {
                    await handleMessagingEvent(msg, account, event);
                }
            }
            // Handle Changes (Comments)
            if (entry.changes) {
                for (const change of entry.changes) {
                    await handleChangeEvent(change, account, event);
                }
            }
        }
        await prisma.webhookEvent.update({
            where: { id: eventId },
            data: { processingStatus: 'DONE', processedAt: new Date() }
        });
    }
    catch (err) {
        console.error(`Error processing event ${eventId}:`, err);
        await prisma.webhookEvent.update({
            where: { id: eventId },
            data: {
                processingStatus: 'ERROR',
                lastError: err.message
            }
        });
    }
}
async function handleMessagingEvent(msg, account, event) {
    const senderId = msg.sender.id;
    const messageText = msg.message?.text || '';
    // Story Reply?
    // Usually story_reply is inside message attachments or type?
    // Quick check: if msg.message.is_echo then ignore (it's us sending)
    if (msg.message?.is_echo)
        return;
    // Determine type
    // If it's a story reply, the webhook usually has specific field or structure?
    // or checks for ref?
    // For simplicity, we treat as DM unless we find specific story id.
    // Actually, let's treat all messages as DM_RECEIVED unless we detect otherwise, 
    // but prompt says "Reply to story (treat as a DM-type response but with a trigger that distinguishes story context)".
    // We'll assume check `story` in message data if available.
    const isStoryReply = !!msg.message?.reply_to?.story;
    const channel = isStoryReply ? 'STORY_REPLY' : 'DM_RECEIVED';
    await evaluateWorkflows(account, channel, messageText, senderId, event, async (text) => {
        // Action: Send DM
        await (0, instagram_api_1.sendDM)(account.accessTokenEncrypted, senderId, text);
    });
}
async function handleChangeEvent(change, account, event) {
    if (change.field === 'comments') {
        // New comment
        const value = change.value;
        const fromId = value.from?.id;
        if (fromId === account.igUserId)
            return; // Ignore self
        const text = value.text;
        const commentId = value.id;
        // value.verb === 'add' ?
        if (value.verb !== 'add')
            return;
        await evaluateWorkflows(account, 'FEED_COMMENT', text, fromId, event, async (replyText) => {
            await (0, instagram_api_1.replyComment)(account.accessTokenEncrypted, commentId, replyText);
        });
    }
}
async function evaluateWorkflows(account, channel, content, senderId, event, executeAction) {
    // Find Workflows
    const workflows = await prisma.workflow.findMany({
        where: {
            workspaceId: account.workspaceId,
            status: 'PUBLISHED',
            isActive: true,
        },
        include: {
            triggers: true,
            actions: true
        }
    });
    for (const wf of workflows) {
        // Check Channel
        const channels = wf.channels; // array
        if (!channels.includes(channel === 'STORY_REPLY' ? 'story' : (channel === 'DM_RECEIVED' ? 'dm' : 'feed'))) {
            // Mapping: DM_RECEIVED -> dm, STORY_REPLY -> story, FEED_COMMENT -> feed
            // Wait, simplify matching:
            // My schema uses json array ["dm","story","feed"]
            // My enum is DM_RECEIVED...
            // Let's normalize.
            const requiredChannel = channel === 'DM_RECEIVED' ? 'dm' : (channel === 'STORY_REPLY' ? 'story' : 'feed');
            if (!channels.includes(requiredChannel))
                continue;
        }
        // Check Trigger Config (Keywords)
        // We assume 1 trigger per workflow for simplicity of this logic, or find the specific trigger row
        const trigger = wf.triggers.find(t => t.type === channel);
        if (!trigger)
            continue; // Should exist if channel matches, but verify
        const config = trigger.configJson;
        const keywords = (config.keywords || []);
        const matchMode = config.matchMode || 'contains'; // contains, exact
        let isMatch = false;
        if (keywords.length === 0) {
            // Empty keywords = Match All? Or Match None?
            // Usually Match All if emtpy?
            // Prompt says "Conditions (keywords...)".
            // Let's assume if keywords empty, it matches EVERYTHING (default behavior for "Welcome"?).
            isMatch = true;
        }
        else {
            const lowerContent = content.toLowerCase();
            if (matchMode === 'exact') {
                isMatch = keywords.some(k => k.toLowerCase() === lowerContent);
            }
            else {
                isMatch = keywords.some(k => lowerContent.includes(k.toLowerCase()));
            }
        }
        if (!isMatch) {
            // Log skipped?
            continue;
        }
        // MATCH FOUND!
        // Check Cooldown / Anti-Spam
        // TODO: Implement AntiSpam check using Redis or DB.
        // For now, skip.
        // Create AutomationRun
        const run = await prisma.automationRun.create({
            data: {
                workflowId: wf.id,
                webhookEventId: event.id,
                status: 'PENDING',
                startedAt: new Date(),
                correlationId: senderId
            }
        });
        try {
            // Execute Actions
            // Assume 1 action: SEND_DM or REPLY_COMMENT
            const action = wf.actions[0]; // Logic for multiple actions? Prompt implies simple reply.
            if (action) {
                const actionConfig = action.configJson;
                const replyTemplate = actionConfig.replyMessage || "Sem mensagem confiugrada";
                // Variable interpolation (TODO)
                await executeAction(replyTemplate);
                await prisma.automationRunLog.create({
                    data: {
                        runId: run.id,
                        level: 'INFO',
                        message: `Action executed: ${action.type}`
                    }
                });
            }
            // Update Stats
            await prisma.workflow.update({
                where: { id: wf.id },
                data: {
                    runCount: { increment: 1 },
                    lastRunAt: new Date()
                }
            });
            await prisma.automationRun.update({
                where: { id: run.id },
                data: { status: 'SUCCESS', finishedAt: new Date() }
            });
        }
        catch (e) {
            await prisma.automationRunLog.create({
                data: {
                    runId: run.id,
                    level: 'ERROR',
                    message: e.message
                }
            });
            await prisma.automationRun.update({
                where: { id: run.id },
                data: { status: 'ERROR', errorMessage: e.message, finishedAt: new Date() }
            });
        }
    }
}
