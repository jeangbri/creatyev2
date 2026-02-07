"use client"

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Instagram, Image as ImageIcon, CheckCircle2, Play, Sparkles, Globe, AtSign, MessageCircle, GitFork } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

// Custom Instagram Card Node
export const InstagramNode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
    const { content = {}, title, subtitle, type, stats = { sent: 0, readRate: '0%' } } = data as any;
    const isCard = !!content.imageUrl;
    const defaultTitle = isCard ? t('editor.cards') : t('editor.buttonsLabel');
    const defaultSubtitle = isCard ? t('editor.cardsDesc') : t('editor.buttonsDesc');

    const nodeTitle = (title && title !== 'Cartões') ? title : defaultTitle;
    const nodeSubtitle = (subtitle && subtitle !== 'Envie cartões interativos.') ? subtitle : defaultSubtitle;

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
                <div className={cn("p-2 rounded-lg", isCard ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600")}>
                    {isCard ? <Instagram size={20} /> : <MessageSquare size={20} />}
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">{nodeTitle}</h3>
                    <p className="text-xs text-slate-500">{nodeSubtitle}</p>
                </div>
            </div>

            {/* Content Preview */}
            <div className="p-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center py-2 border-b border-dashed">
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">{t('editor.sentStats')}</p>
                        <p className="text-xl font-bold text-blue-600">{stats.sent}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase">{t('editor.readStats')}</p>
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
                        {content.message || t('editor.writeMessagePlaceholder')}
                    </p>

                    {/* Button(s) Preview */}
                    {(content.buttons && content.buttons.length > 0) ? (
                        <div className="mt-3 space-y-2">
                            {content.buttons.map((btn: any, idx: number) => (
                                <Button
                                    key={idx}
                                    variant="outline"
                                    className="w-full justify-between bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 h-10"
                                >
                                    <span className="text-xs font-bold uppercase tracking-wider truncate max-w-[200px]">
                                        {btn.label || t('editor.buttonDefault')}
                                    </span>
                                    {btn.stats && (
                                        <Badge variant="secondary" className="bg-blue-200 text-blue-700 hover:bg-blue-300">
                                            {btn.stats}
                                        </Badge>
                                    )}
                                </Button>
                            ))}
                        </div>
                    ) : content.cta?.enabled && (
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                className="w-full justify-between bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 h-10"
                            >
                                <span className="text-xs font-bold uppercase tracking-wider">
                                    {content.cta.text || t('editor.buttonDefault')}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">{t('editor.nextStep')}</span>
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

// Trigger Node (Keyword based)
export const TriggerNode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
    const {
        type = 'DM_RECEIVED',
        config = { keyword: '', matchType: 'exact' }
    } = data as any;

    const icon = type === 'DM_RECEIVED' ? <Play size={18} fill="currentColor" /> :
        type === 'STORY_REPLY' ? <Instagram size={18} /> :
            type === 'STORY_MENTION' || type === 'trigger_mention' ? <AtSign size={18} /> :
                type === 'FEED_COMMENT' || type === 'trigger_comment' ? <MessageCircle size={18} /> : <Play size={18} fill="currentColor" />;

    const typeLabel = type === 'DM_RECEIVED' ? t('createAutomation.channelDm') :
        type === 'STORY_REPLY' ? t('createAutomation.channelStory') :
            type === 'trigger_mention' ? t('editor.nodeMention') :
                type === 'trigger_comment' ? t('createAutomation.channelFeed') : t('editor.trigger');

    return (
        <div className={cn(
            "w-[300px] shadow-lg rounded-xl bg-white border-2 transition-all overflow-hidden",
            selected ? "border-emerald-500 ring-2 ring-emerald-100" : "border-emerald-100",
            "hover:border-emerald-300"
        )}>
            {/* Input Handle (Allow connection from Start or others) */}
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-emerald-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -ml-3"
            />

            {/* Header */}
            <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
                <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-emerald-900 text-sm">{typeLabel}</h3>
                    <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider italic">{t('editor.entryTrigger')}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('editor.ifUserSends')}</p>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700 font-mono">
                            {config.keyword || t('editor.anyKeyword')}
                        </Badge>
                        <span className="text-[10px] text-slate-400">
                            ({config.matchType === 'exact' ? t('editor.exactMatch') : t('editor.containsMatch')})
                        </span>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-2 pt-2">
                    <span className="text-xs font-medium text-slate-400">{t('editor.startFlow')}</span>
                    <div className="bg-emerald-500 w-3 h-3 rounded-full shadow-sm"></div>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-emerald-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-3"
            />
        </div>
    );
});

// Start Node (Old entry, now just a helper or deprecated in favor of Trigger)
export const StartNode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
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
                    <h3 className="font-bold text-slate-800">{t('editor.startNode')}</h3>
                    <p className="text-xs text-slate-500">{t('editor.visualFlow')}</p>
                </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {t('editor.connectTriggerHelp')}
            </p>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-3"
            />
        </div>
    )
})
// Delay Node
export const DelayNode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
    return (
        <div className={cn(
            "w-[280px] shadow-sm rounded-xl bg-white border transition-all",
            selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200",
            "hover:border-blue-300"
        )}>
            <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -ml-2" />

            <div className="p-4 flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">⏳</div>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">{t('editor.nodeDelay')}</h3>
                    <p className="text-xs text-slate-500">{(data as any).time || t('editor.defineTime')}</p>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-2" />
        </div>
    );
});

// Tag Node
export const TagNode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
    return (
        <div className={cn(
            "w-[280px] shadow-sm rounded-xl bg-white border transition-all",
            selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200",
            "hover:border-blue-300"
        )}>
            <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -ml-2" />

            <div className="p-4 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">🏷️</div>
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{t('editor.nodeTag')}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {((data as any).tags || ['TAG_DEMO']).map((tag: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1 h-5">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-2" />
        </div>
    );
});

// AI Response Node
export const AINode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
    return (
        <div className={cn(
            "w-[300px] shadow-lg rounded-xl bg-white border-2 transition-all overflow-hidden",
            selected ? "border-purple-500 ring-2 ring-purple-100" : "border-purple-100",
            "hover:border-purple-300"
        )}>
            <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -ml-2" />

            <div className="p-4 bg-purple-50 border-b border-purple-100 flex items-center gap-3">
                <div className="p-2 bg-purple-500 text-white rounded-lg shadow-sm">
                    <Sparkles size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-purple-900 text-sm">{t('editor.nodeAI')}</h3>
                    <p className="text-[10px] text-purple-600 font-medium uppercase">{t('editor.artificialIntelligence')}</p>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('editor.aiInstruction')}</p>
                    <p className="text-xs text-slate-700 italic truncate italic">
                        "{(data as any).prompt || t('editor.aiPlaceholder')}"
                    </p>
                </div>

                <div className="flex justify-end items-center gap-2 pt-2">
                    <span className="text-xs font-medium text-slate-400">{t('editor.nextStep')}</span>
                    <div className="bg-purple-500 w-3 h-3 rounded-full shadow-sm"></div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-2" />
        </div>
    );
});

// Webhook Node
export const WebhookNode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
    return (
        <div className={cn(
            "w-[300px] shadow-lg rounded-xl bg-white border-2 transition-all overflow-hidden",
            selected ? "border-slate-500 ring-2 ring-slate-100" : "border-slate-200",
            "hover:border-slate-300"
        )}>
            <Handle type="target" position={Position.Left} className="!bg-slate-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -ml-2" />

            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-slate-700 text-white rounded-lg shadow-sm">
                    <Globe size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">{t('editor.nodeWebhook')}</h3>
                    <p className="text-[10px] text-slate-500 font-medium uppercase">{t('editor.externalIntegration')}</p>
                </div>
            </div>

            <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded text-[10px] font-mono text-slate-600 truncate">
                    <Badge variant="outline" className="h-4 px-1 text-[8px] bg-white">POST</Badge>
                    {(data as any).url || 'https://sua-api.com/endpoint'}
                </div>

                <div className="flex justify-end items-center gap-2 pt-2">
                    <span className="text-xs font-medium text-slate-400">{t('editor.nextStep')}</span>
                    <div className="bg-slate-500 w-3 h-3 rounded-full shadow-sm"></div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="!bg-slate-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -mr-2" />
        </div>
    );
});

// Condition Node
export const ConditionNode = memo(({ data, selected }: NodeProps) => {
    const { t } = useLanguage();
    const condition = (data as any).condition || {};
    // Construct label (e.g. "Etiqueta 'REELS GERAL'")
    const label = condition.value
        ? `${condition.field === 'tag' ? t('editor.tag') : t('editor.field')} "${condition.value}"`
        : t('editor.configureCondition');

    return (
        <div className={cn(
            "w-[300px] shadow-lg rounded-xl bg-white border-2 transition-all font-sans",
            selected ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200",
            "hover:border-blue-300"
        )}>
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-blue-500 !w-4 !h-4 !border-4 !border-white !shadow-sm -ml-2"
            />

            {/* Header */}
            <div className="p-4 border-b border-slate-100 pb-3">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <GitFork size={20} className="rotate-90" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-sm">{t('editor.nodeCondition')}</h3>
                        <p className="text-[10px] text-slate-500">{t('editor.conditionEvaluation')}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 pt-3">
                <p className="text-[10px] text-slate-400 text-center">
                    {t('editor.collectingMetrics')}
                </p>

                {/* Condition Label */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg py-3 px-2 text-center">
                    <p className="text-sm font-medium text-slate-700 truncate">
                        {label}
                    </p>
                </div>

                {/* Outputs */}
                <div className="space-y-2">
                    {/* SIM */}
                    <div className="relative bg-emerald-50 border border-emerald-100 rounded-md h-9 flex items-center justify-center">
                        <span className="text-emerald-600 font-bold text-xs tracking-wider">{t('editor.yes')}</span>
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="true"
                            className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white !right-[-6px] !top-1/2 !-translate-y-1/2"
                        />
                    </div>

                    {/* NÃO */}
                    <div className="relative bg-rose-50 border border-rose-100 rounded-md h-9 flex items-center justify-center">
                        <span className="text-rose-600 font-bold text-xs tracking-wider">{t('editor.no')}</span>
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="false"
                            className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white !right-[-6px] !top-1/2 !-translate-y-1/2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
