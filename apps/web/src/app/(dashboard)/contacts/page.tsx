import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { ContactsView } from "./contacts-view";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Não autorizado</div>;

    const workspace = await getPrimaryWorkspace(user.id, user.email || '');

    const contacts = await prisma.contact.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { lastInteraction: 'desc' },
    });

    const serialized = contacts.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        lastInteraction: c.lastInteraction.toISOString(),
    }));

    return <div className="mx-auto max-w-6xl px-8 py-8"><ContactsView contacts={serialized} /></div>;
}
