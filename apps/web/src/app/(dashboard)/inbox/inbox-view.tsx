"use client"

import { useState } from 'react';
import { Inbox, CheckCircle2, XCircle, Clock, Search, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Run {
    id: string;
    status: string;
    startedAt: string;
    finishedAt: string | null;
    errorMessage: string | null;
    workflowTitle: string;
    eventType: string;
    receivedAt: string;
    payload: any;
}

interface InboxViewProps {
    runs: Run[];
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    completed: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Concluído' },
    success: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Concluído' },
    failed: { icon: XCircle, color: 'text-red-500', label: 'Falha' },
    error: { icon: XCircle, color: 'text-red-500', label: 'Erro' },
    running: { icon: Clock, color: 'text-amber-500', label: 'Executando' },
    pending: { icon: Clock, color: 'text-slate-400', label: 'Pendente' },
};

function getEventLabel(type: string) {
    if (type.includes('comment')) return 'Comentário';
    if (type.includes('message') || type.includes('messaging')) return 'Direct';
    if (type.includes('story')) return 'Story';
    if (type.includes('mention')) return 'Menção';
    return type;
}

function getSenderFromPayload(payload: any): string {
    try {
        if (payload?.entry?.[0]?.messaging?.[0]?.sender?.id) {
            return `User ${String(payload.entry[0].messaging[0].sender.id).slice(-4)}`;
        }
        if (payload?.entry?.[0]?.changes?.[0]?.value?.from?.username) {
            return `@${payload.entry[0].changes[0].value.from.username}`;
        }
    } catch { }
    return 'Instagram';
}

export function InboxView({ runs }: InboxViewProps) {
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(runs[0]?.id || null);

    const filtered = runs.filter(r =>
        r.workflowTitle.toLowerCase().includes(search.toLowerCase()) ||
        r.eventType.toLowerCase().includes(search.toLowerCase())
    );

    const selected = runs.find(r => r.id === selectedId);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Inbox</h1>
                <p className="mt-1 text-sm text-slate-400">Histórico de interações e execuções.</p>
            </div>

            {runs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-slate-200 bg-white">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                        <Inbox className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Inbox vazio</p>
                    <p className="text-[13px] text-slate-400 text-center max-w-[280px]">
                        Quando suas automações forem executadas, as interações aparecerão aqui.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
                    {/* Left List */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                <Input
                                    placeholder="Buscar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 h-8 text-[12px] rounded-lg border-slate-200 bg-slate-50"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {filtered.map((run) => {
                                const cfg = statusConfig[run.status] || statusConfig.pending;
                                const StatusIcon = cfg.icon;
                                return (
                                    <button
                                        key={run.id}
                                        onClick={() => setSelectedId(run.id)}
                                        className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors duration-100 ${selectedId === run.id ? 'bg-slate-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[12px] font-semibold text-slate-900 truncate">
                                                {run.workflowTitle}
                                            </span>
                                            <StatusIcon className={`w-3.5 h-3.5 flex-shrink-0 ${cfg.color}`} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] text-slate-400">
                                                {getEventLabel(run.eventType)} · {getSenderFromPayload(run.payload)}
                                            </span>
                                            <span className="text-[10px] text-slate-300">
                                                {formatDistanceToNow(new Date(run.startedAt), { addSuffix: true, locale: ptBR })}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Detail */}
                    <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                        {selected ? (
                            <div className="p-6 space-y-5 overflow-y-auto h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-slate-500" strokeWidth={1.8} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">{selected.workflowTitle}</h3>
                                        <p className="text-[11px] text-slate-400">
                                            {getEventLabel(selected.eventType)} · {new Date(selected.startedAt).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                        <p className={`text-[13px] font-medium ${(statusConfig[selected.status] || statusConfig.pending).color}`}>
                                            {(statusConfig[selected.status] || statusConfig.pending).label}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Remetente</p>
                                        <p className="text-[13px] font-medium text-slate-700">{getSenderFromPayload(selected.payload)}</p>
                                    </div>
                                </div>

                                {selected.errorMessage && (
                                    <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                                        <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-1">Erro</p>
                                        <p className="text-[12px] text-red-600 font-mono">{selected.errorMessage}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Payload</p>
                                    <pre className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 font-mono overflow-auto max-h-[300px]">
                                        {JSON.stringify(selected.payload, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-slate-300">
                                Selecione uma interação
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
