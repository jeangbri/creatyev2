"use client"

import { Zap, Activity, MessageSquare, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

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
        <div className="space-y-10">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                    {t('dashboard.title')}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                    Visão geral do seu workspace.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    {
                        label: t('dashboard.activeAutomations'),
                        value: workflowsCount,
                        icon: Zap,
                        href: "/workflows",
                    },
                    {
                        label: t('dashboard.totalExecutions'),
                        value: runsCount,
                        icon: Activity,
                        sub: t('dashboard.sinceStart'),
                    },
                    {
                        label: t('dashboard.sentResponses'),
                        value: runsCount,
                        icon: MessageSquare,
                    },
                ].map((card, i) => (
                    <div
                        key={i}
                        className="group relative bg-white rounded-xl border border-slate-200/80 p-5 hover:border-slate-300 transition-colors duration-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[13px] font-medium text-slate-400">{card.label}</span>
                            <card.icon className="w-4 h-4 text-slate-300" strokeWidth={1.8} />
                        </div>
                        <p className="text-3xl font-semibold text-slate-900 tabular-nums tracking-tight">
                            {card.value.toLocaleString('pt-BR')}
                        </p>
                        {card.sub && (
                            <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
                        )}
                        {card.href && (
                            <Link
                                href={card.href}
                                className="absolute inset-0 rounded-xl"
                                aria-label={card.label}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Grid */}
            <div className="grid gap-4 lg:grid-cols-5">
                {/* Overview */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                    <div className="flex items-center justify-between p-5 pb-0">
                        <h2 className="text-sm font-semibold text-slate-900">Visão Geral</h2>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                            Últimos 7 dias
                        </span>
                    </div>
                    <div className="p-5">
                        <div className="h-[220px] flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                            <p className="text-sm text-slate-300 font-medium">{t('dashboard.graphPlaceholder')}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                    <div className="flex items-center justify-between p-5 pb-0">
                        <h2 className="text-sm font-semibold text-slate-900">{t('dashboard.recentActivity')}</h2>
                        <button className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5">
                            Ver tudo <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="p-5">
                        <div className="h-[220px] flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
                            <p className="text-sm text-slate-300 font-medium">{t('dashboard.noActivity')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
