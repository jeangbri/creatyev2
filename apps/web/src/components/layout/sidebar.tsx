"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Home,
    Zap,
    MessageSquare,
    Inbox,
    Users,
    Compass,
    LayoutTemplate,
    LogOut,
    Settings,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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
        <aside className="flex h-screen w-[260px] flex-col border-r border-slate-200/80 bg-white">

            {/* Logo */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <img
                        src="https://i.imgur.com/Ntmpj8g.png"
                        alt="Creatye"
                        className="h-7 w-auto object-contain"
                    />
                </Link>
                <LanguageSwitcher />
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-7">
                {sidebarItems.map((group, i) => (
                    <div key={i}>
                        <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {group.title}
                        </p>
                        <ul className="space-y-px">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-colors duration-150",
                                                isActive
                                                    ? "bg-slate-900 text-white"
                                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4 flex-shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                                            {item.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}

                {/* Settings */}
                <div>
                    <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {t('sidebar.configuracoes')}
                    </p>
                    <ul className="space-y-px">
                        <li>
                            <Link
                                href="/settings/integracoes"
                                className={cn(
                                    "flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-colors duration-150",
                                    pathname.startsWith('/settings')
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <Settings className="h-4 w-4 flex-shrink-0" strokeWidth={pathname.startsWith('/settings') ? 2.2 : 1.8} />
                                {t('sidebar.integracoes')}
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-slate-100 p-3 space-y-1">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[11px] font-bold text-white tracking-tight">
                        C
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 truncate">{t('sidebar.meuPerfil')}</p>
                        <p className="text-[11px] text-slate-400 truncate">{t('sidebar.configuracoes')}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                    <LogOut className="h-4 w-4" strokeWidth={1.8} />
                    {t('sidebar.sair')}
                </button>
            </div>
        </aside>
    )
}
