import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { InboxView } from "./inbox-view";

export const dynamic = "force-dynamic";

export default async function InboxPage({ searchParams }: { searchParams: { workflowId?: string } }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Não autorizado</div>;

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    // 1. Get workflows for filter
    const workflows = await prisma.workflow.findMany({
        where: { workspaceId: workspace.id },
        select: { id: true, title: true },
        orderBy: { title: 'asc' }
    });

    // 2. Prepare filter
    const where: any = {
        workflow: { workspaceId: workspace.id }
    };

    if (searchParams.workflowId && searchParams.workflowId !== 'all') {
        where.workflowId = searchParams.workflowId;
    }

    // 3. Fetch runs
    const runs = await prisma.automationRun.findMany({
        where,
        include: {
            workflow: { select: { title: true } },
            webhookEvent: { select: { eventType: true, receivedAt: true, payloadJson: true } },
        },
        orderBy: { startedAt: 'desc' },
        take: 100,
    });

    // 4. Extract IDs to fetch contacts
    const instagramIds = new Set<string>();

    runs.forEach(r => {
        const payload = r.webhookEvent.payloadJson as any;
        // Logic to extract ID based on event type
        let id: string | null = null;
        if (payload?.entry?.[0]?.messaging?.[0]?.sender?.id) {
            id = payload.entry[0].messaging[0].sender.id;
        } else if (payload?.entry?.[0]?.changes?.[0]?.value?.from?.id) {
            id = payload.entry[0].changes[0].value.from.id;
        }

        if (id) instagramIds.add(id);
    });

    // 5. Fetch contacts
    const contacts = await prisma.contact.findMany({
        where: {
            workspaceId: workspace.id,
            instagramId: { in: Array.from(instagramIds) }
        },
        select: { instagramId: true, username: true, fullName: true, profilePicUrl: true }
    });

    const contactMap = new Map(contacts.map(c => [c.instagramId, c]));

    const serialized = runs.map(r => {
        const payload = r.webhookEvent.payloadJson as any;
        let igId: string | null = null;

        // Same extraction logic
        if (payload?.entry?.[0]?.messaging?.[0]?.sender?.id) {
            igId = payload.entry[0].messaging[0].sender.id;
        } else if (payload?.entry?.[0]?.changes?.[0]?.value?.from?.id) {
            igId = payload.entry[0].changes[0].value.from.id;
        }

        const contact = igId ? contactMap.get(igId) : null;
        // Fallback username from payload if available (common in comments)
        const payloadUsername = payload?.entry?.[0]?.changes?.[0]?.value?.from?.username;

        return {
            id: r.id,
            status: r.status,
            startedAt: r.startedAt.toISOString(),
            finishedAt: r.finishedAt?.toISOString() || null,
            errorMessage: r.errorMessage,
            workflowTitle: r.workflow.title,
            eventType: r.webhookEvent.eventType,
            receivedAt: r.webhookEvent.receivedAt.toISOString(),
            payload: payload,
            contact: {
                name: contact?.fullName || contact?.username || payloadUsername || (igId ? `User ${igId.slice(-4)}` : 'Desconhecido'),
                username: contact?.username || payloadUsername,
                profilePicUrl: contact?.profilePicUrl,
                instagramId: igId
            }
        };
    });

    return <InboxView runs={serialized} workflows={workflows} />;
}
