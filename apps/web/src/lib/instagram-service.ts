import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

const IG_API_URL = "https://graph.facebook.com/v21.0";

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
            // Handle Comments (later)
        }
    }
}

async function handleDmEvent(accountId: string, event: any) {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const message = event.message;

    if (message.is_echo) return; // Ignore echoes

    const text = message.text || "";

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

    // 2. Log Webhook Event
    const webhookEvent = await prisma.webhookEvent.create({
        data: {
            workspaceId: account.workspaceId,
            platform: "INSTAGRAM",
            eventType: "DM_RECEIVED",
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
                    type: "DM_RECEIVED"
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
        const trigger = workflow.triggers.find(t => t.type === "DM_RECEIVED");
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

async function runWorkflowActions(workflow: any, account: any, recipientId: string, webhookEventId: string) {
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
            if (action.type === "SEND_DM") {
                const config = action.configJson as any;
                const replyText = config.replyMessage;
                if (replyText) {
                    await sendDm(account, recipientId, replyText);
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

async function sendDm(account: any, recipientId: string, text: string) {
    let accessToken = decrypt(account.accessTokenEncrypted).trim();

    // Debug: Log token prefix to verify decryption
    console.log(`[IG Service] Sending DM with token prefix: ${accessToken.substring(0, 10)}... (Length: ${accessToken.length})`);

    // Replace variables
    // Simple replacement for now. {nome} is hard because we need to fetch user profile first.
    // For now, let's just send the text.

    const url = `${IG_API_URL}/me/messages?access_token=${accessToken}`;

    const body = {
        recipient: { id: recipientId },
        message: { text: text }
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("[IG Service] DM Send Failed:", JSON.stringify(data));

        // Retry logic for expired token could go here (TODO)

        throw new Error(`Failed to send DM: ${JSON.stringify(data)}`);
    }

    return data;
}
