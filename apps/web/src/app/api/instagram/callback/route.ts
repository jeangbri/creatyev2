// Test URL: /api/instagram/callback?hub.mode=subscribe&hub.verify_token=creatye_verify_token&hub.challenge=123456
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { processInstagramEvent } from "@/lib/instagram-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    // --- Webhook Verification Logic ---
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe") {
        if (token === process.env.IG_VERIFY_TOKEN && challenge) {
            return new NextResponse(challenge, {
                status: 200,
                headers: { "content-type": "text/plain; charset=utf-8" },
            });
        }
        return new NextResponse("Forbidden", { status: 403 });
    }
    // ----------------------------------

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code || !state) {
        return NextResponse.redirect(new URL('/settings/integracoes?error=access_denied', req.url));
    }

    try {
        const stateData = JSON.parse(decrypt(state));
        const { workspaceId } = stateData;

        // Exchange code for token (Instagram Login Flow)
        const appId = process.env.IG_APP_ID!;
        const appSecret = process.env.IG_APP_SECRET!;
        const redirectUri = process.env.IG_REDIRECT_URI!; // Ensure this matches exactly what was sent

        console.log(`[IG Callback] Exchanging code via IG API for App ID: ${appId}`);

        const formData = new URLSearchParams();
        formData.append('client_id', appId);
        formData.append('client_secret', appSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', redirectUri);
        formData.append('code', code);

        // Note: We use api.instagram.com for code exchange in IG Login flow
        const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: formData,
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || tokenData.error_message) {
            console.error('IG Token Error', tokenData);
            throw new Error(tokenData.error_message || "Failed to exchange token via IG API");
        }

        console.log('[IG Callback] Token exchanged successfully.');
        console.log('[IG Callback] Token Data:', JSON.stringify(tokenData));

        let finalAccessToken = tokenData.access_token;
        let expiresAt = new Date(Date.now() + 3600 * 1000); // Default 1 hour

        // Exchange for long-lived User Token via Graph API
        try {
            const longLivedUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${tokenData.access_token}`;
            const longLivedRes = await fetch(longLivedUrl);
            const longLivedData = await longLivedRes.json();

            console.log('[IG Callback] Long-lived response:', JSON.stringify(longLivedData));

            if (longLivedData.access_token) {
                finalAccessToken = longLivedData.access_token;
                const expiresSeconds = longLivedData.expires_in || 5184000; // 60 days
                expiresAt = new Date(Date.now() + expiresSeconds * 1000);
            }
        } catch (e) {
            console.error('[IG Callback] Failed to exchange long-lived token', e);
        }

        // Get User Profile
        let igUserId = tokenData.user_id; // Default from Basic connection
        let username = '';
        let profilePicUrl = '';

        try {
            console.log(`[IG Callback] Fetching profile. Initial ID: ${igUserId}`);

            // Strategy: Try Facebook Graph API first using the token.
            // Even with IG Login, if the scopes are Business scopes, FB Graph SHOULD resolve the Business ID.

            const fbGraphUrl = `https://graph.facebook.com/v21.0/me?fields=id,username,profile_picture_url,account_type&access_token=${finalAccessToken}`;
            const fbRes = await fetch(fbGraphUrl);
            const fbData = await fbRes.json();

            console.log('[IG Callback] FB Graph /me response:', JSON.stringify(fbData));

            if (fbRes.ok && fbData.id) {
                igUserId = fbData.id; // PREFER THIS ID (1784...)
                username = fbData.username || '';
                profilePicUrl = fbData.profile_picture_url || '';
                console.log(`[IG Callback] ✅ Resolved Business ID via FB Graph: ${igUserId}`);
            } else {
                // Fallback to IG Graph if FB Graph fails (e.g. strict Basic Display token)
                console.warn('[IG Callback] FB Graph failed, trying IG Graph...', fbData);

                const igGraphUrl = `https://graph.instagram.com/v21.0/me?fields=id,username,profile_picture_url,account_type&access_token=${finalAccessToken}`;
                const igRes = await fetch(igGraphUrl);
                const igData = await igRes.json();
                console.log('[IG Callback] IG Graph /me response:', JSON.stringify(igData));

                if (igRes.ok && igData.id) {
                    igUserId = igData.id;
                    username = igData.username || '';
                    profilePicUrl = igData.profile_picture_url || '';
                }
            }

        } catch (e) {
            console.error('[IG Callback] Profile fetch error:', e);
        }

        if (!username) {
            username = `Instagram User ${igUserId}`;
        }

        console.log(`[IG Callback] Saving account. Workspace: ${workspaceId}, IG User ID: ${igUserId}`);

        // Store in DB
        const result = await prisma.instagramAccount.upsert({
            where: {
                workspaceId_igUserId: {
                    workspaceId,
                    igUserId: String(igUserId)
                }
            },
            update: {
                username: username,
                profilePicUrl: profilePicUrl,
                status: 'CONNECTED',
                accessTokenEncrypted: encrypt(finalAccessToken),
                tokenExpiresAt: expiresAt,
                updatedAt: new Date(),
            },
            create: {
                workspaceId,
                igUserId: String(igUserId),
                username: username,
                profilePicUrl: profilePicUrl,
                status: 'CONNECTED',
                accessTokenEncrypted: encrypt(finalAccessToken),
                tokenExpiresAt: expiresAt
            }
        });

        console.log('[IG Callback] Account saved successfully:', result.id);

        // --- Subscribe to Webhooks ---
        // Strategy: Use the 'me' context on Facebook Graph. 
        // If we have a Business Token (via IG Business Login), 'me' maps to the PAGE/Business Account.

        try {
            console.log(`[IG Callback] Attempting to subscribe 'me' directly via FB Graph...`);

            const subFields = "messages,messaging_postbacks,message_reactions,messaging_optins";
            const meSubUrl = `https://graph.facebook.com/v21.0/me/subscribed_apps?subscribed_fields=${subFields}&access_token=${finalAccessToken}`;

            const subRes = await fetch(meSubUrl, { method: 'POST' });
            const subData = await subRes.json();

            if (subData.success) {
                console.log(`[IG Callback] ✅ Webhook subscribed successfully via 'me' context!`);
                console.log(`[IG Callback] LOG: page_id=me, integration_id=${result.id}, status=subscribed_ok`);

                // Ensure DB has the correct Business ID if we just learned it
                try {
                    const meCheck = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,username&access_token=${finalAccessToken}`);
                    const meCheckData = await meCheck.json();
                    if (meCheck.ok && meCheckData.id && meCheckData.id !== igUserId) {
                        console.log(`[IG Callback] 🔄 FOUND REAL BUSINESS ID: ${meCheckData.id}. Updating DB to replace IGSID ${igUserId}...`);

                        await prisma.instagramAccount.update({
                            where: { id: result.id },
                            data: {
                                igUserId: meCheckData.id,
                                username: meCheckData.username || username
                            }
                        });
                        console.log(`[IG Callback] ✅ DB Updated with Business ID: ${meCheckData.id}`);
                    }
                } catch (fixErr) {
                    console.error('[IG Callback] Failed to swap ID after subscription:', fixErr);
                }

            } else {
                console.warn(`[IG Callback] 'me' Subscription failed:`, subData);

                // Fallback: Try specific ID
                const fbSubUrl = `https://graph.facebook.com/v21.0/${igUserId}/subscribed_apps?subscribed_fields=${subFields}&access_token=${finalAccessToken}`;
                await fetch(fbSubUrl, { method: 'POST' });
            }
        } catch (subErr) {
            console.error(`[IG Callback] Webhook subscription logic crashed:`, subErr);
        }
        // -------------------------------------------------------

        return NextResponse.redirect(new URL('/settings/integracoes?success=true', req.url));

    } catch (err: any) {
        console.error('[IG Callback] CRITICAL ERROR:', err);
        return NextResponse.redirect(new URL(`/settings/integracoes?error=server_error&details=${encodeURIComponent(err.message)}`, req.url));
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const signature = req.headers.get("x-hub-signature-256");

        // Process event (awaiting to ensure completion for MVP)
        // In production, this should be offloaded to a queue.
        await processInstagramEvent(body, signature);

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("Webhook POST Error", e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
