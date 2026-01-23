
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { decrypt } from "@/lib/encryption";

const IG_API_URL = "https://graph.instagram.com/v21.0";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const workspace = await getPrimaryWorkspace(user.id, user.email || '');

        const account = await prisma.instagramAccount.findFirst({
            where: {
                workspaceId: workspace.id,
                status: 'CONNECTED' // Prefer CONNECTED accounts
            }
        });

        if (!account) {
            return NextResponse.json({ error: "No Instagram account connected" }, { status: 404 });
        }

        const token = decrypt(account.accessTokenEncrypted);

        // Fetch Media
        // Only return basic fields needed for selection
        const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,shortcode";
        const url = `${IG_API_URL}/me/media?fields=${fields}&limit=24&access_token=${token}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error("Instagram API Error:", data.error);
            return NextResponse.json({ error: "Instagram API Error", details: data.error }, { status: 502 });
        }

        return NextResponse.json({
            data: data.data || [],
            paging: data.paging
        });

    } catch (e: any) {
        console.error("Error fetching media:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
