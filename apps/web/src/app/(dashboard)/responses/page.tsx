import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { ResponsesView } from "./responses-view";

export const dynamic = "force-dynamic";

export default async function ResponsesPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Não autorizado</div>;

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    const templates = await prisma.responseTemplate.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { updatedAt: 'desc' }
    });

    const serialized = templates.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
    }));

    return <div className="mx-auto max-w-6xl px-8 py-8"><ResponsesView templates={serialized} /></div>;
}
