import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const workspace = await getPrimaryWorkspace(user.id, user.email || '');

        // Find the active Instagram account for this workspace
        const account = await prisma.instagramAccount.findFirst({
            where: {
                workspaceId: workspace.id,
                status: 'CONNECTED'
            }
        });

        if (!account) {
            return NextResponse.json({ error: "No connected account found" }, { status: 404 });
        }

        // Delete (or deactivate) the connection
        // Deleting is usually cleaner if the user intends to disconnect completely
        await prisma.instagramAccount.delete({
            where: { id: account.id }
        });

        // Optional: Pause all automations associated with this workspace?
        // Or just let them fail/log errors? 
        // For safety, let's mark all active workflows as inactive to prevent errors
        await prisma.workflow.updateMany({
            where: { workspaceId: workspace.id, isActive: true },
            data: { isActive: false }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Disconnect Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
