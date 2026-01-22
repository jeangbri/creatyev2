import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { instagramQueue } from "@/lib/queue";
import crypto from "crypto";

// Verification Helper
function verifySignature(body: string, signature: string, secret: string) {
    if (!signature) return false;
    const expected = "sha256=" + crypto.createHmac('sha256', secret).update(body).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function GET(req: NextRequest) {
    // Verification Request from Meta
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const myToken = process.env.IG_VERIFY_TOKEN;

    if (mode === "subscribe" && token === myToken) {
        console.log("Webhook verified");
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-hub-signature-256");
    const bodyText = await req.text();

    // Verify
    const secret = process.env.IG_APP_SECRET!;
    // const isValid = verifySignature(bodyText, signature || '', secret);
    // Important: In dev using Simulator, signature might be fake or missing.
    // And even in prod, sometimes manual entry testing happens.
    // But hard requirement says: "verify X-Hub-Signature-256... if invalid, store event with signatureValid=false and return 401"

    // Note: if simulator is used, we might want to allow it if ENV is dev.
    // But strict requirement says enforce it.
    // We will valid check and store result.

    let isValid = false;
    try {
        isValid = verifySignature(bodyText, signature || '', secret);
    } catch (e) {
        // Signature format might be wrong
        isValid = false;
    }

    // Idempotency: platformEventId.
    // The structure of body is: { object: 'instagram', entry: [ { id, time, messaging: [...] } ] }
    // We need to parse json.
    let payload: any = {};
    try {
        payload = JSON.parse(bodyText);
    } catch (e) {
        return new NextResponse("Invalid JSON", { status: 400 });
    }

    // Important: Instagram sends "entry" array. Could contain multiple changes.
    // We should create a WebhookEvent for EACH significant change or just one for the batch?
    // GAIO/Prompt says: "Persist raw payload... processing ...".
    // Usually we split entries.

    // Let's store the whole batch as one WebhookEvent if parsing fails, but ideally we iterate entries.
    // However, "platformEventId" needs to be unique.
    // Meta batching: one POST can have multiple entries.
    // We will loop through entries and changes.

    // Simplified: Store the entire POST as one event? No, logic says "webhook requests must be persisted".
    // Let's store the whole raw body as one WebhookEvent for simplicity of receiving, THEN worker parses?
    // But Prompt says: "compute platformEventId deterministically from payload ... return 200 quickly".
    // If use whole payload hash as ID, that works for idempotency of the POST.

    const entries = payload.entry || [];

    if (entries.length === 0) {
        // Maybe a test ping? Store it anyway.
    }

    // To follow prompt exactly: "WebHook requests must be persisted (raw payload) ... processWebhookEvent(eventId)"
    // So we save the DB row here.

    // Id generation: Hash of body.
    const platformEventId = crypto.createHash('sha256').update(bodyText).digest('hex');

    // Check if exists
    const existing = await prisma.webhookEvent.findUnique({
        where: { platformEventId }
    });

    if (existing) {
        return NextResponse.json({ ok: true });
    }

    // Create event
    const event = await prisma.webhookEvent.create({
        data: {
            platform: 'INSTAGRAM',
            eventType: payload.object || 'unknown',
            platformEventId,
            payloadJson: payload,
            signatureValid: isValid,
            processingStatus: isValid ? 'PENDING' : 'ERROR', // Don't process if invalid signature? Prompt says return 401 if invalid.
            lastError: isValid ? null : 'Invalid Signature'
        }
    });

    if (!isValid) {
        // Prompt: "if invalid, store event with signatureValid=false and return 401"
        return new NextResponse("Invalid Signature", { status: 401 });
    }

    // Enqueue
    await instagramQueue.add('processWebhookEvent', {
        eventId: event.id
    });

    return NextResponse.json({ ok: true });
}
