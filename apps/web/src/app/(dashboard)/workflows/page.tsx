import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Minhas Automações</h2>
                    <p className="text-muted-foreground">Gerencie seus fluxos de resposta automática</p>
                </div>
                <Link href="/workflows/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Criar automação
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workflows.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        Você ainda não tem automações. Crie a primeira!
                    </div>
                )}
                {workflows.map((wf: any) => (
                    <Card key={wf.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <Link href={`/workflows/${wf.id}/editor`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg truncate pr-2">{wf.title}</CardTitle>
                                    <div className={`w-3 h-3 rounded-full ${wf.isActive ? 'bg-green-500' : 'bg-gray-300'}`} title={wf.isActive ? "Ativo" : "Inativo"} />
                                </div>
                                <CardDescription className="line-clamp-2 min-h-[40px]">{wf.description || "Sem descrição"}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p>Canais: {JSON.parse(JSON.stringify(wf.channels)).join(', ')}</p>
                                    <p>Execuções: {wf.runCount}</p>
                                    <p>Atualizado em: {format(wf.updatedAt, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}</p>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </div>
        </div>
    )
}
