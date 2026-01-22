import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    const account = await prisma.instagramAccount.findFirst({
        where: { workspaceId: workspace.id }
    });

    return NextResponse.json({ account });
}
