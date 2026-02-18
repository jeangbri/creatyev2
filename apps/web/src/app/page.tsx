"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
    MessageSquare,
    Zap,
    BarChart3,
    Shield,
    Instagram,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Clock,
    Users,
    Bot,
    MousePointerClick,
    ChevronDown
} from 'lucide-react'

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check if already logged in, redirect to dashboard
        const checkAuth = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/dashboard')
            }
        }
        checkAuth()
    }, [router])

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-cyan-100">
            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)]'
                : 'bg-transparent'
                }`}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img
                            src="https://i.imgur.com/Ntmpj8g.png"
                            alt="Creatye"
                            className="h-8 w-auto"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                            Funcionalidades
                        </a>
                        <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                            Como Funciona
                        </a>
                        <a href="#benefits" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">
                            Benefícios
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/entrar"
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/registrar"
                            className="text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5"
                        >
                            Começar Grátis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ HERO ═══ */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-white" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-cyan-100/40 via-blue-50/30 to-transparent rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-8 border border-slate-200/50">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                        Plataforma de Automação para Instagram
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                        <span className="text-slate-900">Automatize suas </span>
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
                            conversas
                        </span>
                        <br />
                        <span className="text-slate-900">no Instagram</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Responda mensagens, comentários e stories automaticamente.
                        Crie fluxos inteligentes e aumente seu engajamento sem esforço.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            href="/registrar"
                            className="group flex items-center gap-2 text-base font-bold text-white bg-slate-900 hover:bg-slate-800 px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5"
                        >
                            Começar Agora
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <a
                            href="#features"
                            className="flex items-center gap-2 text-base font-semibold text-slate-500 hover:text-slate-700 px-6 py-4 transition-colors"
                        >
                            Saiba mais
                            <ChevronDown className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-12 md:gap-16">
                        {[
                            { value: '10x', label: 'Mais rápido' },
                            { value: '24/7', label: 'Sempre ativo' },
                            { value: '100%', label: 'Automatizado' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl md:text-3xl font-extrabold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ═══ */}
            <section id="features" className="py-20 md:py-28 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 mb-3">Funcionalidades</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Tudo que você precisa para<br />
                            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                                escalar seu Instagram
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <MessageSquare className="w-5 h-5" />,
                                title: 'Respostas Automáticas em DM',
                                description: 'Configure mensagens automáticas para DMs baseadas em palavras-chave. Responda instantaneamente, 24 horas por dia.',
                                color: 'from-blue-500 to-cyan-500',
                                bgColor: 'bg-blue-50',
                                iconColor: 'text-blue-600'
                            },
                            {
                                icon: <Instagram className="w-5 h-5" />,
                                title: 'Automação de Stories',
                                description: 'Responda automaticamente quando alguém responder ao seu story. Engaje seu público no momento certo.',
                                color: 'from-pink-500 to-rose-500',
                                bgColor: 'bg-pink-50',
                                iconColor: 'text-pink-600'
                            },
                            {
                                icon: <MousePointerClick className="w-5 h-5" />,
                                title: 'Automação de Comentários',
                                description: 'Envie respostas privadas automaticamente quando alguém comentar em seus posts com palavras-chave específicas.',
                                color: 'from-amber-500 to-orange-500',
                                bgColor: 'bg-amber-50',
                                iconColor: 'text-amber-600'
                            },
                            {
                                icon: <Bot className="w-5 h-5" />,
                                title: 'Fluxos Visuais',
                                description: 'Editor visual drag-and-drop para criar fluxos de automação complexos, com condições, delays e etiquetas.',
                                color: 'from-emerald-500 to-teal-500',
                                bgColor: 'bg-emerald-50',
                                iconColor: 'text-emerald-600'
                            },
                            {
                                icon: <Users className="w-5 h-5" />,
                                title: 'Gestão de Contatos',
                                description: 'Organize seus leads com etiquetas, acompanhe interações e segmente sua audiência automaticamente.',
                                color: 'from-indigo-500 to-violet-500',
                                bgColor: 'bg-indigo-50',
                                iconColor: 'text-indigo-600'
                            },
                            {
                                icon: <BarChart3 className="w-5 h-5" />,
                                title: 'Dashboard Analítico',
                                description: 'Acompanhe métricas em tempo real: mensagens enviadas, taxas de leitura e performance das automações.',
                                color: 'from-slate-600 to-slate-800',
                                bgColor: 'bg-slate-100',
                                iconColor: 'text-slate-600'
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} ${feature.iconColor} mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section id="how-it-works" className="py-20 md:py-28 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 mb-3">Como Funciona</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Três passos para automatizar
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Conecte sua conta',
                                description: 'Vincule sua conta do Instagram Business em poucos cliques. Conexão segura via API oficial da Meta.',
                                icon: <Instagram className="w-6 h-6" />
                            },
                            {
                                step: '02',
                                title: 'Crie seu fluxo',
                                description: 'Use o editor visual para montar sua automação. Defina gatilhos, mensagens, delays e condições.',
                                icon: <Zap className="w-6 h-6" />
                            },
                            {
                                step: '03',
                                title: 'Publique e monitore',
                                description: 'Ative sua automação e acompanhe os resultados em tempo real pelo dashboard.',
                                icon: <BarChart3 className="w-6 h-6" />
                            },
                        ].map((item, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg shadow-slate-200/50 mb-6 text-slate-900 group-hover:shadow-xl group-hover:shadow-cyan-100/50 group-hover:-translate-y-1 transition-all duration-500">
                                    {item.icon}
                                </div>
                                <p className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-cyan-500 mb-2">Passo {item.step}</p>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>

                                {i < 2 && (
                                    <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 w-12 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ BENEFITS ═══ */}
            <section id="benefits" className="py-20 md:py-28 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600 mb-3">Por que o Creatye?</p>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
                                Foque no que importa,<br />
                                nós cuidamos do resto
                            </h2>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                Pare de perder tempo respondendo mensagens repetitivas. Com o Creatye, suas automações
                                trabalham por você enquanto você foca em criar conteúdo e crescer sua marca.
                            </p>

                            <div className="space-y-4">
                                {[
                                    'Respostas instantâneas, mesmo enquanto você dorme',
                                    'Fluxos ilimitados de automação',
                                    'Segmentação inteligente por etiquetas',
                                    'Integração direta com a API oficial do Instagram',
                                    'Dashboard com métricas em tempo real',
                                    'Suporte a múltiplos tipos de gatilho',
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-slate-600 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                <div className="space-y-6">
                                    {/* Simulated automation cards */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-emerald-50 rounded-lg">
                                                <Zap className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Fluxo de Boas-vindas</p>
                                                <p className="text-[10px] text-emerald-500 font-semibold uppercase">Ativo</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] px-2 py-1 bg-slate-100 rounded-md text-slate-500 font-medium">DM</span>
                                            <span className="text-[10px] px-2 py-1 bg-slate-100 rounded-md text-slate-500 font-medium">Story</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Resposta Comentários</p>
                                                <p className="text-[10px] text-emerald-500 font-semibold uppercase">Ativo</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] px-2 py-1 bg-slate-100 rounded-md text-slate-500 font-medium">Feed</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 opacity-60">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-amber-50 rounded-lg">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Sequência de Follow-up</p>
                                                <p className="text-[10px] text-slate-400 font-semibold uppercase">Rascunho</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ SECURITY ═══ */}
            <section className="py-16 bg-slate-50 border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center md:text-left">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-500 font-medium">API Oficial da Meta</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200 hidden md:block" />
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-500 font-medium">Dados criptografados</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200 hidden md:block" />
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-500 font-medium">99.9% Uptime</span>
                        </div>
                        <div className="h-4 w-px bg-slate-200 hidden md:block" />
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-500 font-medium">Suporte dedicado</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FINAL CTA ═══ */}
            <section className="py-20 md:py-28 bg-white">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Pronto para automatizar<br />seu Instagram?
                    </h2>
                    <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
                        Comece agora e veja seus resultados crescerem com respostas automáticas inteligentes.
                    </p>

                    <Link
                        href="/registrar"
                        className="group inline-flex items-center gap-2 text-base font-bold text-white bg-slate-900 hover:bg-slate-800 px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-0.5"
                    >
                        Criar Conta Gratuita
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <p className="text-xs text-slate-400 mt-4 font-medium">
                        Sem cartão de crédito • Configuração em minutos
                    </p>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="py-10 border-t border-slate-100 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <img
                                src="https://i.imgur.com/Ntmpj8g.png"
                                alt="Creatye"
                                className="h-6 w-auto opacity-60"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <Link href="/entrar" className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium">
                                Entrar
                            </Link>
                            <Link href="/registrar" className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium">
                                Registrar
                            </Link>
                            <a href="mailto:suporte@creatye.com.br" className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium">
                                Suporte
                            </a>
                        </div>

                        <p className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                            © {new Date().getFullYear()} Creatye. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
