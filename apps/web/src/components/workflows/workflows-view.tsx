"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
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
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        {t('workflows.title')}
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">{t('workflows.subtitle')}</p>
                </div>
                <Link href="/workflows/create">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-4 text-[13px] font-medium gap-1.5 transition-colors duration-150">
                        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                        {t('workflows.createButton')}
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {workflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-slate-200 bg-white">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                        <Zap className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Nenhuma automação</p>
                    <p className="text-[13px] text-slate-400 mb-5 text-center max-w-[280px]">
                        {t('workflows.emptyState')}
                    </p>
                    <Link href="/workflows/create">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-4 text-[13px] font-medium gap-1.5 transition-colors duration-150">
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Criar automação
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {workflows.map((wf) => (
                        <WorkflowCard key={wf.id} workflow={wf} />
                    ))}
                </div>
            )}
        </div>
    )
}
