"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus, Zap, Sparkles } from "lucide-react";
import { WorkflowCard } from "@/components/workflow-card";
import { useLanguage } from "@/contexts/language-context";

interface WorkflowsViewProps {
    workflows: any[];
}

export function WorkflowsView({ workflows }: WorkflowsViewProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {t('workflows.title')}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">{t('workflows.subtitle')}</p>
                </div>
                <Link href="/workflows/create">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-5 shadow-sm hover:shadow-md transition-all duration-200 gap-2 font-semibold">
                        <Plus className="h-4 w-4" />
                        {t('workflows.createButton')}
                    </Button>
                </Link>
            </div>

            {/* Workflows Grid */}
            {workflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                            <Zap className="w-9 h-9 text-amber-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-cyan-600" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhuma automação ainda</h3>
                    <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
                        {t('workflows.emptyState')}
                    </p>
                    <Link href="/workflows/create">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 px-5 shadow-sm hover:shadow-md transition-all duration-200 gap-2 font-medium">
                            <Plus className="h-4 w-4" />
                            Criar primeira automação
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workflows.map((wf) => (
                        <WorkflowCard
                            key={wf.id}
                            workflow={wf}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
