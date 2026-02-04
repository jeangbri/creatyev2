import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { WorkflowsView } from "@/components/workflows/workflows-view";

export const dynamic = "force-dynamic";

export default async function WorkflowsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Não autorizado</div>;

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    const workflows = await prisma.workflow.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { updatedAt: 'desc' }
    });

    const serializedWorkflows = workflows.map(wf => ({
        ...wf,
        updatedAt: wf.updatedAt.toISOString(),
        createdAt: wf.createdAt.toISOString(),
        publishedAt: wf.publishedAt ? wf.publishedAt.toISOString() : null
    }));

    return <WorkflowsView workflows={serializedWorkflows} />;
}
