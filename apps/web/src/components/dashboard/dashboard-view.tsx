"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Activity, MessageSquare, TrendingUp, ArrowUpRight } from "lucide-react";
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

    const statCards = [
        {
            label: t('dashboard.activeAutomations'),
            value: workflowsCount,
            icon: Zap,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
            accentBorder: "border-l-amber-400",
            trend: null,
        },
        {
            label: t('dashboard.totalExecutions'),
            value: runsCount,
            icon: Activity,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            accentBorder: "border-l-emerald-400",
            trend: t('dashboard.sinceStart'),
        },
        {
            label: t('dashboard.sentResponses'),
            value: runsCount,
            icon: MessageSquare,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            accentBorder: "border-l-blue-400",
            trend: null,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {t('dashboard.title')}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Acompanhe o desempenho das suas automações em tempo real.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card, i) => (
                    <Card key={i} className={`relative overflow-hidden border-l-4 ${card.accentBorder} bg-white shadow-sm hover:shadow-md transition-shadow duration-300`}>
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-slate-900 tabular-nums">
                                            {card.value.toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                    {card.trend && (
                                        <p className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                            <TrendingUp className="w-3 h-3" />
                                            {card.trend}
                                        </p>
                                    )}
                                </div>
                                <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${card.iconBg}`}>
                                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid gap-5 lg:grid-cols-7">
                {/* Chart Area */}
                <Card className="lg:col-span-4 bg-white shadow-sm overflow-hidden">
                    <div className="p-6 pb-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Visão Geral</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Últimos 7 dias</p>
                        </div>
                        <button className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                            Ver detalhes <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="px-6 pb-6">
                        <div className="h-[200px] flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                            <div className="text-center">
                                <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-400 font-medium">{t('dashboard.graphPlaceholder')}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-3 bg-white shadow-sm overflow-hidden">
                    <div className="p-6 pb-3">
                        <h3 className="text-base font-semibold text-slate-900">{t('dashboard.recentActivity')}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Atividade recente</p>
                    </div>
                    <div className="px-6 pb-6">
                        <div className="h-[200px] flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                            <div className="text-center">
                                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-400 font-medium">{t('dashboard.noActivity')}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
