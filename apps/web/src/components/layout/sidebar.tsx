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
    LogOut,
    Settings,
    ChevronRight
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
                { label: t('sidebar.geral'), href: "/dashboard", icon: Home, color: "text-blue-500" },
            ]
        },
        {
            title: t('sidebar.automacoes'),
            items: [
                { label: t('sidebar.automacoes'), href: "/workflows", icon: Zap, color: "text-amber-500" },
                { label: t('sidebar.respostas'), href: "/responses", icon: MessageSquare, color: "text-emerald-500" },
            ]
        },
        {
            title: t('sidebar.leads'),
            items: [
                { label: t('sidebar.inbox'), href: "/inbox", icon: Inbox, color: "text-cyan-500" },
                { label: t('sidebar.liveChat'), href: "/chat", icon: MessageCircle, color: "text-pink-500" },
                { label: t('sidebar.ranking'), href: "/ranking", icon: Trophy, color: "text-yellow-500" },
                { label: t('sidebar.contatos'), href: "/contacts", icon: Users, color: "text-indigo-500" },
            ]
        },
        {
            title: t('sidebar.comunidade'),
            items: [
                { label: t('sidebar.explorar'), href: "/explore", icon: Compass, color: "text-teal-500" },
                { label: t('sidebar.meusTemplates'), href: "/templates", icon: LayoutTemplate, color: "text-orange-500" },
            ]
        }
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/entrar')
        router.refresh()
    }

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-950 text-white border-r border-white/[0.06] relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-indigo-950/20 pointer-events-none" />

            {/* Logo Area */}
            <div className="relative z-10 p-5 flex items-center justify-between border-b border-white/[0.06]">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <img
                        src="https://i.imgur.com/Ntmpj8g.png"
                        alt="Creatye Logo"
                        className="h-8 w-auto object-contain transition-all duration-300 group-hover:brightness-125"
                    />
                </Link>
                <LanguageSwitcher />
            </div>

            {/* Navigation */}
            <div className="relative z-10 flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
                {sidebarItems.map((group, i) => (
                    <div key={i}>
                        <h3 className="mb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                            {group.title}
                        </h3>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                                            isActive
                                                ? "bg-white/[0.08] text-white shadow-sm"
                                                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                        )}
                                    >
                                        {/* Active indicator bar */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                                        )}
                                        <item.icon className={cn(
                                            "h-[18px] w-[18px] transition-all duration-200 flex-shrink-0",
                                            isActive ? item.color : "text-slate-500 group-hover/item:text-slate-300"
                                        )} />
                                        <span className="flex-1 truncate">{item.label}</span>
                                        {isActive && (
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Settings */}
                <div>
                    <h3 className="mb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                        {t('sidebar.configuracoes')}
                    </h3>
                    <div className="space-y-0.5">
                        <Link
                            href="/settings/integracoes"
                            className={cn(
                                "group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                                pathname.startsWith('/settings')
                                    ? "bg-white/[0.08] text-white shadow-sm"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                            )}
                        >
                            {pathname.startsWith('/settings') && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                            )}
                            <Settings className={cn(
                                "h-[18px] w-[18px] transition-all duration-200 flex-shrink-0",
                                pathname.startsWith('/settings') ? "text-slate-300" : "text-slate-500 group-hover/item:text-slate-300"
                            )} />
                            <span className="flex-1 truncate">{t('sidebar.integracoes')}</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Profile */}
            <div className="relative z-10 border-t border-white/[0.06] p-3 space-y-2">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 transition-colors hover:bg-white/[0.06] cursor-default">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-semibold text-white">{t('sidebar.meuPerfil')}</p>
                        <p className="truncate text-[11px] text-slate-500">{t('sidebar.configuracoes')}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-10 text-sm font-medium transition-all duration-200"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    {t('sidebar.sair')}
                </Button>
            </div>
        </div>
    )
}
