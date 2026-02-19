"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, RefreshCw, CheckCircle, LogOut, AlertCircle, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
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

export default function IntegrationsPage() {
    const [loading, setLoading] = useState(true)
    const [disconnecting, setDisconnecting] = useState(false)
    const [account, setAccount] = useState<any>(null)
    const router = useRouter()
    const supabase = createClient()
    const { t } = useLanguage()

    useEffect(() => {
        fetchStatus()
    }, [])

    const fetchStatus = async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

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
        window.location.href = '/api/instagram/connect'
    }

    const handleRevalidate = () => {
        window.location.href = '/api/instagram/connect?revalidate=true'
    }

    const handleDisconnect = async () => {
        setDisconnecting(true)
        try {
            const res = await fetch('/api/instagram/disconnect', {
                method: 'POST'
            })

            if (res.ok) {
                setAccount(null)
                toast.success(t('common.success'))
                router.refresh()
            } else {
                toast.error(t('common.error'))
            }
        } catch (e) {
            toast.error(t('common.error'))
        } finally {
            setDisconnecting(false)
        }
    }

    return (
        <div className="mx-auto max-w-6xl px-8 py-8">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('integrations.title')}</h2>
                    <p className="text-muted-foreground">{t('integrations.subtitle')}</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/20">
                                    <Instagram className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <CardTitle>{t('integrations.instagram.title')}</CardTitle>
                                    <CardDescription>{t('integrations.instagram.description')}</CardDescription>
                                </div>
                            </div>
                            {account?.status === 'CONNECTED' ? (
                                <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                    <CheckCircle className="w-3 h-3 mr-1" /> {t('integrations.instagram.connected')}
                                </Badge>
                            ) : (
                                <Badge variant="secondary">{t('workflows.card.inactive')}</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-blue-900">
                                        Requisito da API Oficial do Instagram
                                    </p>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        Para conectar sua conta, ela precisa ser do tipo <strong>Criador de Conteúdo</strong> ou <strong>Comercial (Business)</strong>. Contas pessoais não são suportadas pela API oficial.
                                    </p>
                                    <a
                                        href="https://help.instagram.com/502981923235522"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline mt-2 transition-colors"
                                    >
                                        Ver instruções oficiais <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        </div>

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
                                {/* You might want to translate this explicitly too if it's dynamic */}
                                {t('integrations.instagram.description')}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        {!account || account.status !== 'CONNECTED' ? (
                            <Button onClick={handleConnect} disabled={loading}>
                                {t('integrations.instagram.connectButton')}
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleRevalidate}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {t('integrations.instagram.revalidateButton')}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={disconnecting}>
                                            <LogOut className="w-4 h-4 mr-2" />
                                            {t('integrations.instagram.disconnectButton')}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{t('common.confirmDisconnectTitle')}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {t('common.confirmDisconnectDesc')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDisconnect} className="bg-destructive hover:bg-destructive/90">
                                                {disconnecting ? t('common.disconnecting') : t('common.disconnect')}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
