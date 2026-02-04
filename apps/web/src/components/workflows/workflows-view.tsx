"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkflowCard } from "@/components/workflow-card";
import { useLanguage } from "@/contexts/language-context";

interface WorkflowsViewProps {
    workflows: any[];
}

export function WorkflowsView({ workflows }: WorkflowsViewProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('workflows.title')}</h2>
                    <p className="text-muted-foreground">{t('workflows.subtitle')}</p>
                </div>
                <Link href="/workflows/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> {t('workflows.createButton')}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workflows.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        {t('workflows.emptyState')}
                    </div>
                )}
                {workflows.map((wf) => (
                    <WorkflowCard
                        key={wf.id}
                        workflow={wf}
                    />
                ))}
            </div>
        </div>
    )
}
