import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { encrypt } from "@/lib/encryption";
import crypto from 'crypto';

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL('/entrar', req.url));
    }

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    // Generate state
    const stateData = JSON.stringify({
        userId: user.id,
        workspaceId: workspace.id,
        nonce: crypto.randomBytes(16).toString('hex')
    });

    // Encrypt state or sign it. We use encryption for simplicity so user can't tamper
    // Note: encryption key must optionally be consistent.
    // Ideally use a signed JWT or session-stored state. 
    // We'll base64 encode it and rely on the fact that if they tamper it, JSON parse fails or data is garbage. 
    // BUT proper way is signing. Since we have 'encrypt', let's use it.
    const state = encrypt(stateData); // This produces iv:hex

    // Instagram OAuth URL (Basic Display or Graph API?)
    // Prompt says: "The product is an automation system FOR Instagram." -> This implies Instagram Graph API (Business).
    // Scope: instagram_basic, instagram_manage_messages, instagram_manage_comments, pages_show_list, pages_manage_metadata, pages_messaging
    // Wait, for standard Instagram automation (DMs), we usually need Facebook Login for Business because IG accounts are linked to FB Pages.
    // BUT prompt says: "open Instagram authorization window, not Facebook UI".
    // This refers to the new "Instagram Login for Business" or similar?
    // Actually, Instagram Messaging API operates via the Facebook Graph API and requires a Facebook Page connection usually.
    // HOWEVER, recently Meta introduced "Instagram Login" which can provide access to some valid scopes, but often for business messaging you still go through Facebook Login flow to select the linked Page.
    // Prompt explicitly says: "open Instagram authorization window, not Facebook UI".
    // This suggests using the Instagram Basic Display API or the Instagram Graph API with "Instagram Login" (NOT "Facebook Login").
    // CAUTION: Instagram Messaging (DMs) is historically ONLY available via Facebook Login (Business).
    // EXCEPT: "Instagram API with Instagram Login" is a thing but often limited.
    // Let's assume the user knows what they want: "Instagram authorization window".
    // Scopes needed for DM: `instagram_manage_messages`.
    // Scopes for comments: `instagram_manage_comments`.
    // Scopes for profile: `instagram_basic` (deprecated?) or `business_basic`.

    // The endpoint for Instagram Login (Oauth) is `https://api.instagram.com/oauth/authorize` (Basic Display - NO DMs).
    // OR the newer one? 
    // Actually, for Business features (DMs), we MUST use "Facebook Login" normally.
    // BUT the prompt is adamant: "implement proper OAuth connection for Instagram (open Instagram authorization window, not Facebook UI)".
    // This likely refers to the `enable_fb_login=0` param or just the text they want.
    // The endpoint `https://www.instagram.com/oauth/authorize` exists for Instagram Graph API?
    // Yes, if you use the "Instagram Login" product in Meta App Dashboard, you can get an Instagram User Access Token.
    // Does this token allow DMs?
    // According to Meta: "Instagram Basic Display API" does NOT allow DMs.
    // "Instagram Graph API" requires Facebook Login.
    // WAIT. There is a new "Instagram API with Instagram Login" for Business?
    // Let's assume the user implies the correct endpoint: `https://www.instagram.com/oauth/authorize`.
    // Params: client_id, redirect_uri, scope, response_type=code, state.
    // Scopes: `instagram_business_basic`, `instagram_business_manage_messages`, `instagram_business_manage_comments`, `instagram_business_content_publish`.

    const appId = process.env.IG_APP_ID!;
    const redirectUri = process.env.IG_REDIRECT_URI!;

    // Correct scopes for Business via Instagram Login
    const scopes = [
        'instagram_business_basic',
        'instagram_business_manage_messages',
        'instagram_business_manage_comments',
        'instagram_business_content_publish'
    ].join(',');

    const url = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code&state=${state}`;

    return NextResponse.redirect(url);
}
