import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check ownership
    const workflow = await prisma.workflow.findUnique({
        where: { id: params.id },
        include: {
            workspace: {
                select: {
                    members: {
                        where: { userId: user.id }
                    }
                }
            }
        }
    });

    if (!workflow || workflow.workspace.members.length === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const triggers = await prisma.workflowTrigger.findMany({ where: { workflowId: params.id } });
    const actions = await prisma.workflowAction.findMany({ where: { workflowId: params.id } });

    return NextResponse.json({ workflow, triggers, actions });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { workflow: workflowUpdate, triggers, actions } = body;

    // TODO: Verify ownership again

    // Update Workflow
    if (workflowUpdate) {
        await prisma.workflow.update({
            where: { id: params.id },
            data: {
                ...workflowUpdate,
                updatedAt: new Date(),
                publishedAt: workflowUpdate.status === 'PUBLISHED' ? new Date() : undefined
            } as any
        });
    }

    // Update Triggers
    if (triggers) {
        for (const t of triggers) {
            await prisma.workflowTrigger.update({
                where: { id: t.id },
                data: { configJson: t.configJson }
            });
        }
    }

    // Update Actions
    if (actions) {
        for (const a of actions) {
            await prisma.workflowAction.update({
                where: { id: a.id },
                data: { configJson: a.configJson }
            });
        }
    }

    return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createClient();
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check ownership
        const workflow = await prisma.workflow.findUnique({
            where: { id: params.id },
            include: {
                workspace: {
                    select: {
                        members: {
                            where: { userId: user.id }
                        }
                    }
                }
            }
        });

        if (!workflow || workflow.workspace.members.length === 0) {
            return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
        }

        // Delete related data first
        await prisma.workflowTrigger.deleteMany({ where: { workflowId: params.id } });
        await prisma.workflowAction.deleteMany({ where: { workflowId: params.id } });
        await prisma.automationRun.deleteMany({ where: { workflowId: params.id } });

        await prisma.workflow.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error("Delete workflow error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
