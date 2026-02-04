"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

    // Helper to format date consistent with locale
    const dateFormat = language === 'pt' ? "d 'de' MMMM 'às' HH:mm" : "MMMM d 'at' h:mm a";

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer relative group overflow-hidden">
            <Link href={`/workflows/${workflow.id}/editor`} className="block h-full">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg truncate pr-8">{workflow.title}</CardTitle>
                        <div
                            className={`w-3 h-3 min-w-[12px] rounded-full ${workflow.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                            title={workflow.isActive ? t('workflows.card.active') : t('workflows.card.inactive')}
                        />
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                        {workflow.description || t('workflows.card.noDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                            {t('workflows.card.channels')} {Array.isArray(workflow.channels)
                                ? workflow.channels.join(', ')
                                : JSON.parse(JSON.stringify(workflow.channels)).join(', ')}
                        </p>
                        <p>{t('workflows.card.executions')} {workflow.runCount}</p>
                        <p>
                            {t('workflows.card.updatedAt')} {format(updatedAt, dateFormat, { locale: dateLocale })}
                        </p>
                    </div>
                </CardContent>
            </Link>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <Trash2 className="h-4 w-4" />
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
        </Card>
    )
}
