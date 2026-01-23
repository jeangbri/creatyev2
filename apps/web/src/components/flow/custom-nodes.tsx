"use client"

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Instagram, Image as ImageIcon, CheckCircle2, Play } from 'lucide-react';
import { cn } from "@/lib/utils";

// Custom Instagram Card Node
export const InstagramNode = memo(({ data, selected }: NodeProps) => {
    const {
        title = 'Cartões',
        subtitle = 'Envie cartões interativos.',
        stats = { sent: 0, read: 0, readRate: '0%' },
        content = {},
        type = 'reply' // trigger, reply
    } = data as any;

    return (
        <div className={cn(
            "w-[350px] shadow-lg rounded-xl bg-white border-2 transition-all",
            selected ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent",
            "hover:border-blue-300"
        )}>
            {/* Handles */}
            {type !== 'trigger' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -ml-2"
                />
            )}

            {/* Header */}
            <div className="p-4 border-b flex items-start gap-3 bg-slate-50/50 rounded-t-xl">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                    <Instagram size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">{title}</h3>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>

            {/* Content Preview */}
            <div className="p-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center py-2 border-b border-dashed">
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Envios</p>
                        <p className="text-xl font-bold text-blue-600">{stats.sent}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">Leituras</p>
                        <p className="text-xl font-bold text-blue-600">{stats.readRate}</p>
                    </div>
                </div>

                {/* Message Mockup */}
                <div className="bg-slate-100 p-3 rounded-lg relative overflow-hidden group">
                    {/* Image Preview */}
                    {content.imageUrl ? (
                        <div className="aspect-square w-full rounded-md overflow-hidden bg-slate-200 mb-3 relative">
                            {/* Using a placeholder if remote image */}
                            <img
                                src={content.imageUrl}
                                alt="Preview"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ) : null}

                    {/* Text Preview */}
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {content.message || "Escreva sua mensagem aqui..."}
                    </p>

                    {/* Button(s) Preview */}
                    {content.cta?.enabled && (
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                className="w-full justify-between bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 h-10"
                            >
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {content.cta.text || "Botão"}
                                </span>
                                {content.cta.stats && (
                                    <Badge variant="secondary" className="bg-blue-200 text-blue-700 hover:bg-blue-300">
                                        {content.cta.stats}
                                    </Badge>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">Próximo passo</span>
                    <div className="bg-blue-500 w-3 h-3 rounded-full shadow-sm"></div>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-2"
            />
        </div>
    );
});

// Start Node
export const StartNode = memo(({ data, selected }: NodeProps) => {
    return (
        <div className={cn(
            "w-[280px] shadow-sm rounded-xl bg-white border transition-all p-6",
            selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-100",
            "hover:border-blue-300"
        )}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Início</h3>
                    <p className="text-xs text-slate-500">Conecte os nós para iniciar</p>
                </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Arraste o ponto azul para adicionar novos blocos e construir seu fluxo.
            </p>

            <div className="flex justify-end items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Próximo passo</span>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-3"
            />
        </div>
    )
})
