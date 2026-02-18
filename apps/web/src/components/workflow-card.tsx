"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLanguage } from '@/contexts/language-context';

interface WorkflowCardProps {
    workflow: any;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const { t, language } = useLanguage();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setDeleting(true);
        try {
            const res = await fetch(`/api/workflows/${workflow.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Falha ao excluir");

            toast.success(t('workflows.card.deletedSuccess'));
            router.refresh();
        } catch (error) {
            toast.error(t('workflows.card.deleteError'));
        } finally {
            setDeleting(false);
        }
    }

    const updatedAt = new Date(workflow.updatedAt);
    const dateLocale = language === 'pt' ? ptBR : enUS;
    const dateFormat = language === 'pt' ? "d MMM, HH:mm" : "MMM d, h:mm a";

    const channels = Array.isArray(workflow.channels)
        ? workflow.channels
        : JSON.parse(JSON.stringify(workflow.channels));

    return (
        <Link
            href={`/workflows/${workflow.id}/editor`}
            className="group block bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 p-4 transition-all duration-200 relative"
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                    {workflow.title}
                </h3>
                <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${workflow.isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                    <span className={`w-1 h-1 rounded-full ${workflow.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {workflow.isActive ? t('workflows.card.active') : t('workflows.card.inactive')}
                </span>
            </div>

            {/* Description */}
            <p className="text-[12px] text-slate-400 line-clamp-1 mb-4">
                {workflow.description || t('workflows.card.noDescription')}
            </p>

            {/* Bottom meta */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{channels.join(', ')}</span>
                    <span className="text-slate-200">·</span>
                    <span>{workflow.runCount} runs</span>
                </div>
                <span className="text-[11px] text-slate-300">
                    {format(updatedAt, dateFormat, { locale: dateLocale })}
                </span>
            </div>

            {/* Delete */}
            <div className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('common.confirmDeleteTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('common.confirmDeleteDesc')} &ldquo;{workflow.title}&rdquo;
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                {t('common.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={deleting}
                            >
                                {deleting ? t('common.deleting') : t('common.delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Link>
    )
}
