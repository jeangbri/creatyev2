import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getPrimaryWorkspace } from "@/lib/workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Activity, MessageSquare } from "lucide-react";

export default async function DashboardPage() {
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

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Automações Ativas
                        </CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{workflowsCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Execuções Totais
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{runsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Desde o início
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Respostas Enviadas
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{runsCount}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Visão Geral</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Gráfico de execuções (Em breve)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Nenhuma atividade recente.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
