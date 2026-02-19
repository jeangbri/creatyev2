import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const workspace = await getPrimaryWorkspace(user.id, user.email || '');
        const { name, body } = await request.json();

        const existing = await prisma.responseTemplate.findFirst({
            where: { id: params.id, workspaceId: workspace.id }
        });

        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

        const updated = await prisma.responseTemplate.update({
            where: { id: params.id },
            data: { name, body }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const workspace = await getPrimaryWorkspace(user.id, user.email || '');

        const existing = await prisma.responseTemplate.findFirst({
            where: { id: params.id, workspaceId: workspace.id }
        });

        if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

        await prisma.responseTemplate.delete({ where: { id: params.id } });

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
