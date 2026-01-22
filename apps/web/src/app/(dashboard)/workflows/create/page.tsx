"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client' // Client version? We need server action usually, but client is fine for prototype.
// Actually, we should call an API route to Create, because we need Prisma.
// Client Supabase cannot insert into Prisma tables directly unless using Edge Functions + REST, but we have Next.js API.
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

export default function CreateWorkflowPage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [channels, setChannels] = useState<{ dm: boolean, story: boolean, feed: boolean }>({
        dm: true,
        story: false,
        feed: false
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCreate = async () => {
        if (!title) {
            toast.error("O título é obrigatório");
            return;
        }

        const selectedChannels = [];
        if (channels.dm) selectedChannels.push('dm');
        if (channels.story) selectedChannels.push('story');
        if (channels.feed) selectedChannels.push('feed');

        if (selectedChannels.length === 0) {
            toast.error("Selecione pelo menos um canal");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/workflows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    channels: selectedChannels
                })
            });

            if (!res.ok) throw new Error("Falha ao criar");

            const data = await res.json();
            toast.success("Automação criada!");
            router.push(`/workflows/${data.id}/editor`);
        } catch (e) {
            console.error(e);
            toast.error("Erro ao criar automação");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Criar Automação</h2>
                <p className="text-muted-foreground">Configure os detalhes iniciais do seu fluxo</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            placeholder="Ex: Resposta de Boas-vindas"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desc">Descrição</Label>
                        <Input
                            id="desc"
                            placeholder="Opcional"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <Label>Onde a sua automação deverá funcionar?</Label>
                        <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="dm" checked={channels.dm} onCheckedChange={(c) => setChannels(p => ({ ...p, dm: c as boolean }))} />
                                <Label htmlFor="dm">Mensagem Direta (DM)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="story" checked={channels.story} onCheckedChange={(c) => setChannels(p => ({ ...p, story: c as boolean }))} />
                                <Label htmlFor="story">Resposta à Story</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="feed" checked={channels.feed} onCheckedChange={(c) => setChannels(p => ({ ...p, feed: c as boolean }))} />
                                <Label htmlFor="feed">Comentário no Feed</Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                    <Button onClick={handleCreate} disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Automação'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
