"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Activity, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface DashboardViewProps {
    stats: {
        workflowsCount: number;
        runsCount: number;
    }
}

export function DashboardView({ stats }: DashboardViewProps) {
    const { t } = useLanguage();
    const { workflowsCount, runsCount } = stats;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.activeAutomations')}
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
                            {t('dashboard.totalExecutions')}
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{runsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('dashboard.sinceStart')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('dashboard.sentResponses')}
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
                        <CardTitle>{t('dashboard.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            {t('dashboard.graphPlaceholder')}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            {t('dashboard.noActivity')}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
