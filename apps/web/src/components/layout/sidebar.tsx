"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Home,
    Zap,
    MessageSquare,
    Inbox,
    MessageCircle,
    Trophy,
    Users,
    Compass,
    LayoutTemplate,
    HelpCircle,
    LogOut,
    Settings
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const { t } = useLanguage()

    const sidebarItems = [
        {
            title: t('sidebar.principal'),
            items: [
                { label: t('sidebar.geral'), href: "/dashboard", icon: Home },
            ]
        },
        {
            title: t('sidebar.automacoes'),
            items: [
                { label: t('sidebar.automacoes'), href: "/workflows", icon: Zap },
                { label: t('sidebar.respostas'), href: "/responses", icon: MessageSquare },
            ]
        },
        {
            title: t('sidebar.leads'),
            items: [
                { label: t('sidebar.inbox'), href: "/inbox", icon: Inbox },
                { label: t('sidebar.liveChat'), href: "/chat", icon: MessageCircle },
                { label: t('sidebar.ranking'), href: "/ranking", icon: Trophy },
                { label: t('sidebar.contatos'), href: "/contacts", icon: Users },
            ]
        },
        {
            title: t('sidebar.comunidade'),
            items: [
                { label: t('sidebar.explorar'), href: "/explore", icon: Compass },
                { label: t('sidebar.meusTemplates'), href: "/templates", icon: LayoutTemplate },
            ]
        }
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/entrar')
        router.refresh()
    }

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
            <div className="p-6 flex items-center justify-between">
                <Link href="/dashboard" className="block">
                    <img
                        src="https://i.imgur.com/Ntmpj8g.png"
                        alt="Creatye Logo"
                        className="h-8 w-auto object-contain transition-transform hover:scale-105"
                    />
                </Link>
                <LanguageSwitcher />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {sidebarItems.map((group, i) => (
                    <div key={i} className="mb-6">
                        <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Settings explicit link */}
                <div className="mb-6">
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t('sidebar.configuracoes')}
                    </h3>
                    <div className="space-y-1">
                        <Link
                            href="/settings/integracoes"
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname.startsWith('/settings') ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <Settings className="h-4 w-4" />
                            {t('sidebar.integracoes')}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t p-4">
                <div className="mb-4 flex items-center gap-3 rounded-md border bg-background p-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-xs font-medium">{t('sidebar.meuPerfil')}</p>
                        <p className="truncate text-xs text-muted-foreground">{t('sidebar.configuracoes')}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    {t('sidebar.sair')}
                </Button>
            </div>
        </div>
    )
}
