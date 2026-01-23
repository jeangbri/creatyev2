"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
// Client Supabase? We are in client comp.
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Need Textarea
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch" // Need switch
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import { Save, Play, Pause } from 'lucide-react'

export default function EditorPage() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [workflow, setWorkflow] = useState<any>(null);
    const [triggers, setTriggers] = useState<any[]>([]);
    const [actions, setActions] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchWorkflow();
    }, [id]);

    const fetchWorkflow = async () => {
        const res = await fetch(`/api/workflows/${id}`);
        if (res.ok) {
            const data = await res.json();
            setWorkflow(data.workflow);
            // Prepare triggers for UI: convert keyword array to string
            const uiTriggers = data.triggers.map((t: any) => {
                if (Array.isArray(t.configJson.keywords)) {
                    // Ensure we have a string for the input
                    t.configJson.keywords = t.configJson.keywords.join(', ');
                }
                return t;
            });
            setTriggers(uiTriggers);
            setActions(data.actions);
        }
        setLoading(false);
    }

    const handleSave = async (publish = false) => {
        setSaving(true);
        try {
            // Prepare triggers for API: convert keyword string back to array
            const apiTriggers = triggers.map(t => {
                const trigger = JSON.parse(JSON.stringify(t));
                if (typeof trigger.configJson.keywords === 'string') {
                    trigger.configJson.keywords = trigger.configJson.keywords
                        .split(',')
                        .map((k: string) => k.trim())
                        .filter((k: string) => k !== '');
                } else if (!trigger.configJson.keywords) {
                    trigger.configJson.keywords = [];
                }
                return trigger;
            });

            const res = await fetch(`/api/workflows/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workflow: {
                        status: publish ? 'PUBLISHED' : workflow.status
                    },
                    triggers: apiTriggers,
                    actions
                })
            });

            if (!res.ok) throw new Error("Erro ao salvar");

            toast.success(publish ? "Automação Publicada!" : "Salvo com sucesso!");
            if (publish) {
                setWorkflow({ ...workflow, status: 'PUBLISHED' });
            }
        } catch (e) {
            toast.error("Erro ao salvar");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div>Carregando editor...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{workflow.title}</h2>
                        <Badge variant={workflow.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                            {workflow.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{workflow.description}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving} className={workflow.status === 'PUBLISHED' ? "bg-amber-600 hover:bg-amber-700" : ""}>
                        {workflow.status === 'PUBLISHED' ? 'Atualizar Publicação' : 'Publicar'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Triggers Column */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Gatilhos (Quando acontecer...)</h3>
                    {triggers.map((trigger, idx) => (
                        <Card key={trigger.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base uppercase tracking-wide text-xs text-muted-foreground font-bold">
                                    {trigger.type === 'DM_RECEIVED' ? 'Mensagem Direta' :
                                        trigger.type === 'STORY_REPLY' ? 'Resposta ao Story' :
                                            'Comentário no Feed'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Modo de Correspondência</label>
                                    <select
                                        className="text-sm border rounded p-1"
                                        value={trigger.configJson.matchMode}
                                        onChange={(e) => {
                                            const newTriggers = [...triggers];
                                            newTriggers[idx].configJson.matchMode = e.target.value;
                                            setTriggers(newTriggers);
                                        }}
                                    >
                                        <option value="contains">Contém (Parcial)</option>
                                        <option value="exact">Exato</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Palavras-chave (separadas por vírgula)</label>
                                    <Input
                                        placeholder="Ex: preço, valor, comprar"
                                        value={trigger.configJson.keywords || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const newTriggers = [...triggers];
                                            newTriggers[idx].configJson.keywords = val;
                                            setTriggers(newTriggers);
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">Deixe vazio para responder a TUDO.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Actions Column */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Ação (Faça isso...)</h3>
                    {actions.map((action, idx) => (
                        <Card key={action.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base uppercase tracking-wide text-xs text-muted-foreground font-bold">
                                    Enviar Resposta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Mensagem de Resposta</label>
                                    <Textarea
                                        className="min-h-[150px]"
                                        placeholder="Olá! Tudo bem?"
                                        value={action.configJson.replyMessage || ''}
                                        onChange={(e) => {
                                            const newActions = [...actions];
                                            newActions[idx].configJson.replyMessage = e.target.value;
                                            setActions(newActions);
                                        }}
                                    />
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        <span>Variáveis disponíveis:</span>
                                        <Badge variant="outline" className="cursor-pointer">{"{nome}"}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
