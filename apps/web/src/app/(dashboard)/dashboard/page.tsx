import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { ServerConfigError } from "@/components/ServerConfigError";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return <div>Não autorizado</div>;

        const workspace = await getPrimaryWorkspace(user.id, user.email || '');

        // Stats
        const workflowsCount = await prisma.workflow.count({
            where: { workspaceId: workspace.id, isActive: true }
        });

        const runsCount = await prisma.automationRun.count({
            where: {
                workflow: { workspaceId: workspace.id }
            }
        });

        return <div className="mx-auto max-w-6xl px-8 py-8"><DashboardView stats={{ workflowsCount, runsCount }} /></div>;

    } catch (error: any) {
        console.error("Dashboard Error:", error);
        return <ServerConfigError details={{
            message: error?.message || "Erro desconhecido",
            env_engine: process.env.PRISMA_CLIENT_ENGINE_TYPE,
            env_node: process.env.NODE_ENV
        }} />;
    }
}
