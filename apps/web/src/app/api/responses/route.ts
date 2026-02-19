import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const workspace = await getPrimaryWorkspace(user.id, user.email || '');
        const { name, body } = await request.json();

        if (!name || !body) {
            return NextResponse.json({ error: "name and body required" }, { status: 400 });
        }

        const template = await prisma.responseTemplate.create({
            data: { workspaceId: workspace.id, name, body }
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const workspace = await getPrimaryWorkspace(user.id, user.email || '');

        const templates = await prisma.responseTemplate.findMany({
            where: { workspaceId: workspace.id },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(templates);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
