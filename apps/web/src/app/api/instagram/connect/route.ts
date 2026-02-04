import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { encrypt } from "@/lib/encryption";
import crypto from 'crypto';

export const dynamic = "force-dynamic";

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

    const state = encrypt(stateData);

    const appId = process.env.IG_APP_ID!;
    const redirectUri = process.env.IG_REDIRECT_URI!;

    // Instagram Login (Business Compatible)
    // We switched back to this because the User's App ID is invalid for Facebook Login (likely an IG-only App ID).
    // We utilize the 'instagram_business_*' scopes to try and get a token capable of Webhooks.

    const scopes = [
        'instagram_business_basic',
        'instagram_business_manage_messages',
        'instagram_business_manage_comments',
        'instagram_business_content_publish'
    ].join(',');

    const authUrl = new URL('https://www.instagram.com/oauth/authorize');
    authUrl.searchParams.append('enable_fb_login', '1');
    authUrl.searchParams.append('force_authentication', '1');
    authUrl.searchParams.append('client_id', appId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', state);

    return NextResponse.redirect(authUrl.toString());
}
