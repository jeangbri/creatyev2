"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { Trash2, Zap, Clock, Radio, MoreVertical } from "lucide-react";
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
    const dateFormat = language === 'pt' ? "d 'de' MMMM 'às' HH:mm" : "MMMM d 'at' h:mm a";

    return (
        <div className="group relative bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden">
            <Link href={`/workflows/${workflow.id}/editor`} className="block p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-slate-900 truncate">
                                {workflow.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {workflow.description || t('workflows.card.noDescription')}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${workflow.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${workflow.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`} />
                        {workflow.isActive ? t('workflows.card.active') : t('workflows.card.inactive')}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 my-3" />

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <Radio className="w-3 h-3" />
                        {Array.isArray(workflow.channels)
                            ? workflow.channels.join(', ')
                            : JSON.parse(JSON.stringify(workflow.channels)).join(', ')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />
                        {workflow.runCount} runs
                    </span>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2.5">
                    <Clock className="w-3 h-3" />
                    {format(updatedAt, dateFormat, { locale: dateLocale })}
                </div>
            </Link>

            {/* Delete Button */}
            <div className="absolute top-4 right-14 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('common.confirmDeleteTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('common.confirmDeleteDesc')} "{workflow.title}"
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                {t('common.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive hover:bg-destructive/90 text-white"
                                disabled={deleting}
                            >
                                {deleting ? t('common.deleting') : t('common.delete')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
