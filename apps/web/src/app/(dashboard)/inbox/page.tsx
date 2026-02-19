import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { InboxView } from "./inbox-view";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Não autorizado</div>;

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    const runs = await prisma.automationRun.findMany({
        where: {
            workflow: { workspaceId: workspace.id }
        },
        include: {
            workflow: { select: { title: true } },
            webhookEvent: { select: { eventType: true, receivedAt: true, payloadJson: true } },
        },
        orderBy: { startedAt: 'desc' },
        take: 100,
    });

    const serialized = runs.map(r => ({
        id: r.id,
        status: r.status,
        startedAt: r.startedAt.toISOString(),
        finishedAt: r.finishedAt?.toISOString() || null,
        errorMessage: r.errorMessage,
        workflowTitle: r.workflow.title,
        eventType: r.webhookEvent.eventType,
        receivedAt: r.webhookEvent.receivedAt.toISOString(),
        payload: r.webhookEvent.payloadJson as any,
    }));

    return <InboxView runs={serialized} />;
}
