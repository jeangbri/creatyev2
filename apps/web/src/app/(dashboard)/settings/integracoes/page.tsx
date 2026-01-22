"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge" // Need Badge
import { Instagram, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function IntegrationsPage() {
    const [loading, setLoading] = useState(true)
    const [account, setAccount] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchStatus()
    }, [])

    const fetchStatus = async () => {
        try {
            setLoading(true)
            // We need an endpoint to get current workspace's IG account
            // For now, let's assume we have a user and we look up their workspace
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // In real app, we fetch from API
            const res = await fetch('/api/instagram/status')
            if (res.ok) {
                const data = await res.json()
                setAccount(data.account)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleConnect = () => {
        // Redirect to API route that initiates OAuth
        window.location.href = '/api/instagram/connect'
    }

    const handleRevalidate = () => {
        window.location.href = '/api/instagram/connect?revalidate=true'
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Integrações</h2>
                <p className="text-muted-foreground">Gerencie suas conexões com o Instagram e Facebook.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/20">
                                <Instagram className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                                <CardTitle>Instagram</CardTitle>
                                <CardDescription>Conecte sua conta profissional para automações</CardDescription>
                            </div>
                        </div>
                        {account?.status === 'CONNECTED' ? (
                            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" /> Conectado
                            </Badge>
                        ) : (
                            <Badge variant="secondary">Desconectado</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="h-20 animate-pulse bg-muted rounded-md" />
                    ) : account ? (
                        <div className="rounded-md border p-4 bg-muted/50">
                            <div className="flex items-center gap-3">
                                {account.profilePicUrl && (
                                    <img src={account.profilePicUrl} alt={account.username} className="w-10 h-10 rounded-full" />
                                )}
                                <div>
                                    <p className="font-semibold">{account.username}</p>
                                    <p className="text-xs text-muted-foreground">ID: {account.igUserId}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Nenhuma conta conectada. Clique abaixo para iniciar.
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex gap-2">
                    {!account || account.status !== 'CONNECTED' ? (
                        <Button onClick={handleConnect} disabled={loading}>
                            Conectar Instagram
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={handleRevalidate}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Revalidar conexão
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
