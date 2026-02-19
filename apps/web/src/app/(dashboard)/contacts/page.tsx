import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { ContactsView } from "./contacts-view";

export const dynamic = "force-dynamic";

export default async function ContactsPage({ searchParams }: { searchParams: { workflowId?: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Não autorizado</div>;

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    // 1. Get workflows for filter dropdown
    const workflows = await prisma.workflow.findMany({
        where: { workspaceId: workspace.id },
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
    });

    // 2. Prepare filter logic
    let contactFilter: any = { workspaceId: workspace.id };

    if (searchParams.workflowId && searchParams.workflowId !== 'all') {
        // Find contacts that have interacted with this specific workflow
        const relevantRuns = await prisma.automationRun.findMany({
            where: {
                workflowId: searchParams.workflowId,
                // We could add status: 'SUCCESS' if we only want successful ones, but usually any interaction counts
            },
            select: { correlationId: true },
            distinct: ['correlationId']
        });

        const contactIds = relevantRuns.map(r => r.correlationId).filter(Boolean);

        contactFilter.instagramId = { in: contactIds };
    }

    // 3. Fetch Contacts
    const contacts = await prisma.contact.findMany({
        where: contactFilter,
        orderBy: { lastInteraction: 'desc' },
        take: 100 // Limit for performance
    });

    const serialized = contacts.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        lastInteraction: c.lastInteraction.toISOString(),
    }));

    return <ContactsView contacts={serialized} workflows={workflows} />;
}
