"use client"

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
    MessageSquare,
    Zap,
    BarChart3,
    Shield,
    Instagram,
    ArrowRight,
    CheckCircle2,
    Users,
    MousePointerClick,
    Plus,
    Minus,
    Menu,
    X,
    Cpu,
    Sparkles,
    Bot,
    Globe
} from 'lucide-react'
import { translations, Language } from '@/lib/translations'

// --- Utility Components ---

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true)
                observer.disconnect()
            }
        }, { threshold: 0.1 })

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 transform ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border border-slate-100 rounded-2xl mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="text-lg font-semibold text-slate-800">{question}</span>
                <span className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-cyan-100 rotate-180' : 'bg-slate-50'}`}>
                    {isOpen ? (
                        <Minus className="w-5 h-5 text-cyan-600" />
                    ) : (
                        <Plus className="w-5 h-5 text-slate-400" />
                    )}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-transparent">
                    {answer}
                </div>
            </div>
        </div>
    )
}

// --- Main Page Component ---

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [language, setLanguage] = useState<Language>('pt')

    const t = translations[language].landing;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'pt' ? 'en' : 'pt')
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">

            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
                ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm py-3'
                : 'bg-transparent border-transparent py-5'
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://i.imgur.com/Ntmpj8g.png"
                            alt="Creatye"
                            className="h-9 w-auto hover:brightness-110 transition-all"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-slate-200/50 shadow-sm">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">{t.nav.features}</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">{t.nav.howItWorks}</a>
                        <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">{t.nav.faq}</a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors px-3 py-2 rounded-full bg-slate-50 border border-slate-200"
                        >
                            <Globe className="w-4 h-4" />
                            {language.toUpperCase()}
                        </button>
                        <Link
                            href="/entrar"
                            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
                        >
                            {t.nav.login}
                        </Link>
                        <Link
                            href="/registrar"
                            className="relative group overflow-hidden rounded-full px-6 py-2.5 bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/10 hover:shadow-cyan-500/20 transition-all hover:-translate-y-0.5"
                        >
                            <span className="relative z-10 group-hover:text-cyan-50 transition-colors">{t.nav.register}</span>
                            <div className="absolute inset-0 bg-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-slate-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
                        <a href="#features" className="text-lg font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.features}</a>
                        <a href="#how-it-works" className="text-lg font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.howItWorks}</a>
                        <a href="#faq" className="text-lg font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.faq}</a>
                        <button
                            onClick={() => {
                                toggleLanguage();
                                setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-2 text-lg font-medium text-slate-600 py-2"
                        >
                            <Globe className="w-5 h-5" />
                            {language === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}
                        </button>
                        <hr className="border-slate-100 my-2" />
                        <Link href="/entrar" className="text-lg font-medium text-slate-600">{t.nav.login}</Link>
                        <Link href="/registrar" className="text-lg font-bold text-cyan-600">{t.nav.register}</Link>
                    </div>
                )}
            </nav>

            {/* ═══ HERO SECTION (LIQUIGLASS) ═══ */}
            <section className="relative pt-40 pb-32 md:pt-48 md:pb-40 overflow-hidden bg-slate-50">

                {/* --- ANIMATED LIQUID BACKGROUND START --- */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                    {/* Orb 1: Cyan/Blue (Top Left) */}
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>

                    {/* Orb 2: Purple/Indigo (Top Right) */}
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

                    {/* Orb 3: Pink/Rose (Bottom Center - Moving) */}
                    <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

                    {/* Orb 4: Extra Blue depth (Middle) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>

                    {/* Glass Overlay (Frost effect) */}
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[80px]"></div>

                    {/* Grain Texture (Subtle Noise) */}
                    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                </div>
                {/* --- ANIMATED LIQUID BACKGROUND END --- */}


                <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">

                    {/* Left Column: Text */}
                    <div className="text-center lg:text-left">
                        <Reveal>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm mb-8 hover:bg-white/80 transition-all mx-auto lg:mx-0">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                    {t.hero.badge}
                                </span>
                            </div>
                        </Reveal>

                        <Reveal delay={100}>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 drop-shadow-sm">
                                {t.hero.titleLine1} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 animate-gradient-xy bg-[length:200%_auto]">
                                    {t.hero.titleLine2}
                                </span> <br />
                                {t.hero.titleLine3}
                            </h1>
                        </Reveal>

                        <Reveal delay={200}>
                            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium opacity-90">
                                {t.hero.description}
                            </p>
                        </Reveal>

                        <Reveal delay={300}>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/registrar"
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-bold text-white bg-slate-900 hover:bg-slate-800 px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-cyan-500/30 hover:-translate-y-1"
                                >
                                    {t.hero.ctaPrimary}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <a
                                    href="#how-it-works"
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold text-slate-700 bg-white/70 hover:bg-white border border-slate-200/60 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    {t.hero.ctaSecondary}
                                </a>
                            </div>
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1 rounded-full border border-white/20 shadow-sm backdrop-blur-sm">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.hero.check1}
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/40 px-3 py-1 rounded-full border border-white/20 shadow-sm backdrop-blur-sm">
                                    <Shield className="w-4 h-4 text-emerald-500" /> {t.hero.check2}
                                </span>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Column: Visual Mockup */}
                    <div className="relative mt-12 lg:mt-0 z-10 flex justify-center lg:justify-end perspective-1000">
                        <Reveal delay={400} className="w-full max-w-[500px]">
                            {/* Glass Card Backdrop Effect behind phone */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-cyan-100/30 to-purple-100/30 rounded-[3rem] blur-3xl -z-10 animate-pulse"></div>

                            {/* Floating Elements around phone */}
                            <div className="absolute -left-8 top-32 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 animate-float z-20 hidden md:flex items-center gap-3 w-48 hover:scale-105 transition-transform cursor-default">
                                <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                    <Instagram className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Novo Lead</p>
                                    <p className="text-sm font-bold text-slate-800">Direct Recebido</p>
                                </div>
                            </div>

                            <div className="absolute -right-4 bottom-40 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 animate-float-delayed z-20 hidden md:flex items-center gap-3 w-52 hover:scale-105 transition-transform cursor-default">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                                    <Zap className="text-emerald-600 w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Automação</p>
                                    <p className="text-sm font-bold text-emerald-600">Respondido (1s)</p>
                                </div>
                            </div>

                            {/* Main Phone Mockup */}
                            <div className="relative mx-auto border-slate-900 bg-slate-900 border-[12px] rounded-[3rem] h-[640px] w-[320px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/20 transform rotate-1 hover:rotate-0 transition-transform duration-700">
                                <div className="absolute inset-0 rounded-[2.2rem] overflow-hidden bg-white">

                                    {/* Phone Notch */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-7 w-40 bg-slate-900 rounded-b-2xl z-20"></div>

                                    {/* App Header */}
                                    <div className="bg-white/90 backdrop-blur-sm p-4 border-b border-slate-100 flex items-center justify-between pt-10 sticky top-0 z-10 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden border border-slate-200">
                                                    <img src="https://ui-avatars.com/api/?name=Cliente+Loja&background=random" alt="User" />
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Cliente Loja</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{t.footer.chatSimulation.online}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/50 pb-24 h-full scrollbar-hide">

                                        {/* Timestamp */}
                                        <div className="text-center">
                                            <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full font-medium">{t.footer.chatSimulation.today} 14:32</span>
                                        </div>

                                        {/* User Message */}
                                        <div className="flex justify-end items-end gap-2 group">
                                            <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-md shadow-cyan-100 transition-transform group-hover:scale-[1.02]">
                                                Olá! Gostaria de saber o preço do tênis que postaram no story 😍
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm self-end mb-1">
                                                <img src="https://ui-avatars.com/api/?name=Eu&background=0284c7&color=fff" alt="Me" />
                                            </div>
                                        </div>

                                        {/* Bot Reply - Delayed animation visually */}
                                        <div className="flex justify-start items-end gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-forwards opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
                                            <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex-shrink-0 border-2 border-slate-100 shadow-sm p-1 flex items-center justify-center">
                                                <img src="https://i.imgur.com/Ntmpj8g.png" alt="Bot" className="w-full h-auto" />
                                            </div>
                                            <div className="bg-white text-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] border border-slate-100 shadow-sm transition-transform group-hover:scale-[1.02]">
                                                <p className="font-bold mb-1.5 text-cyan-600 text-[10px] uppercase tracking-wide flex items-center gap-1">
                                                    <Bot className="w-3 h-3" /> {t.footer.chatSimulation.automaticReply}
                                                </p>
                                                Oii! Tudo bem? ✨
                                                <br />
                                                O modelo <span className="font-bold text-slate-900">Air Max</span> está saindo por apenas <span className="font-bold text-emerald-600">R$ 299,90</span> hoje!
                                                <br /><br />
                                                Quer que eu te envie o link com frete grátis? 👇
                                            </div>
                                        </div>

                                        {/* User Reply 2 */}
                                        <div className="flex justify-end items-end gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[2500ms] fill-mode-forwards opacity-0" style={{ animationDelay: '3s', animationFillMode: 'forwards' }}>
                                            <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] shadow-md transition-transform group-hover:scale-[1.02]">
                                                Sim, quero!
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm self-end mb-1">
                                                <img src="https://ui-avatars.com/api/?name=Eu&background=0284c7&color=fff" alt="Me" />
                                            </div>
                                        </div>

                                        {/* Bot Reply 2 */}
                                        <div className="flex justify-start items-end gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[4000ms] fill-mode-forwards opacity-0" style={{ animationDelay: '4.5s', animationFillMode: 'forwards' }}>
                                            <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex-shrink-0 border-2 border-slate-100 shadow-sm p-1 flex items-center justify-center">
                                                <img src="https://i.imgur.com/Ntmpj8g.png" alt="Bot" className="w-full h-auto" />
                                            </div>
                                            <div className="bg-white text-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] border border-slate-100 shadow-sm transition-transform group-hover:scale-[1.02]">
                                                Perfeito! 🎉 Aqui está o link exclusivo:
                                                <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2 hover:bg-slate-100 transition-colors cursor-pointer">
                                                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">Shop</div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-slate-900 truncate">Nike Air Max 2024</p>
                                                        <p className="text-[10px] text-blue-500 truncate">loja.com/tenis-promo</p>
                                                    </div>
                                                </div>
                                                <br />
                                                Corre que é só até as 18h! 🏃‍♂️
                                            </div>
                                        </div>

                                    </div>

                                    {/* Input Area */}
                                    <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 pb-8">
                                        <div className="h-10 bg-slate-100 rounded-full w-full flex items-center px-4 text-xs text-slate-400 justify-between">
                                            <span>Enviar mensagem...</span>
                                            <div className="flex gap-2 opacity-50">
                                                <div className="w-4 h-4 rounded bg-slate-300"></div>
                                                <div className="w-4 h-4 rounded bg-cyan-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══ STATS BANNER ═══ */}
            <section className="py-10 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: t.stats.messages, value: "+1.5M" },
                        { label: t.stats.sales, value: "R$ 12M+" },
                        { label: t.stats.time, value: "+50k h" },
                        { label: t.stats.clients, value: "2.300+" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center group hover:-translate-y-1 transition-transform">
                            <p className="text-3xl font-extrabold text-cyan-400 mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ PROBLEMS / SOLUTIONS (Features) ═══ */}
            <section id="features" className="py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <Reveal>
                        <div className="text-center max-w-3xl mx-auto mb-24">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                                {t.features.title} <br /> <span className="text-cyan-600">{t.features.titleAccent}</span>
                            </h2>
                            <p className="text-lg text-slate-500">
                                {t.features.subtitle}
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MessageSquare className="w-8 h-8 text-white" />,
                                color: "bg-cyan-500",
                                title: t.features.item1Title,
                                desc: t.features.item1Desc
                            },
                            {
                                icon: <Instagram className="w-8 h-8 text-white" />,
                                color: "bg-pink-500",
                                title: t.features.item2Title,
                                desc: t.features.item2Desc
                            },
                            {
                                icon: <MousePointerClick className="w-8 h-8 text-white" />,
                                color: "bg-amber-500",
                                title: t.features.item3Title,
                                desc: t.features.item3Desc
                            },
                            {
                                icon: <Zap className="w-8 h-8 text-white" />,
                                color: "bg-emerald-500",
                                title: t.features.item4Title,
                                desc: t.features.item4Desc
                            },
                            {
                                icon: <Users className="w-8 h-8 text-white" />,
                                color: "bg-indigo-500",
                                title: t.features.item5Title,
                                desc: t.features.item5Desc
                            },
                            {
                                icon: <BarChart3 className="w-8 h-8 text-white" />,
                                color: "bg-violet-500",
                                title: t.features.item6Title,
                                desc: t.features.item6Desc
                            }
                        ].map((feature, i) => (
                            <Reveal key={i} delay={i * 100}>
                                <div className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-cyan-100/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed relative z-10">
                                        {feature.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section id="how-it-works" className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <Reveal>
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">{t.howItWorks.title}</h2>
                            <p className="text-slate-500 max-w-2xl mx-auto">{t.howItWorks.subtitle}</p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Desktop connection line */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gradient-to-r from-slate-200 via-cyan-300 to-slate-200 border-t border-b border-white z-0" />

                        {[
                            { step: "01", title: t.howItWorks.step1Title, desc: t.howItWorks.step1Desc },
                            { step: "02", title: t.howItWorks.step2Title, desc: t.howItWorks.step2Desc },
                            { step: "03", title: t.howItWorks.step3Title, desc: t.howItWorks.step3Desc }
                        ].map((item, i) => (
                            <Reveal key={i} delay={i * 200}>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-slate-50 flex items-center justify-center mb-8 group hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-blue-600">{item.step}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-500 px-8">{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TRUST & SECURITY ═══ */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">{t.trust.badge}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: <Shield className="w-6 h-6" />, text: "Criptografia E2E" },
                            { icon: <Cpu className="w-6 h-6" />, text: "99.9% Uptime" },
                            { icon: <CheckCircle2 className="w-6 h-6" />, text: "API Oficial Meta" },
                            { icon: <Shield className="w-6 h-6" />, text: "LGPD Compliance" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                <div className="text-cyan-600 mb-3">{item.icon}</div>
                                <span className="font-semibold text-slate-700">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FAQ SECTION ═══ */}
            <section id="faq" className="py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-6">
                    <Reveal>
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{t.faq.title}</h2>
                            <p className="text-slate-500">{t.faq.subtitle}</p>
                        </div>
                    </Reveal>

                    <Reveal delay={200}>
                        <FAQItem question={t.faq.questions.q1} answer={t.faq.questions.a1} />
                        <FAQItem question={t.faq.questions.q2} answer={t.faq.questions.a2} />
                        <FAQItem question={t.faq.questions.q3} answer={t.faq.questions.a3} />
                        <FAQItem question={t.faq.questions.q4} answer={t.faq.questions.a4} />
                    </Reveal>
                </div>
            </section>

            {/* ═══ CTA FOOTER ═══ */}
            <section className="relative py-32 bg-slate-900 overflow-hidden text-center px-6">
                {/* Background Effects */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <Reveal>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
                            {t.cta.title} <br /> {t.cta.titleAccent}
                        </h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                            {t.cta.subtitle}
                        </p>
                        <Link
                            href="/registrar"
                            className="inline-flex items-center gap-3 text-lg font-bold text-slate-900 bg-white hover:bg-cyan-50 px-12 py-5 rounded-full transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(8,145,178,0.5)] hover:-translate-y-1 group"
                        >
                            <Sparkles className="w-5 h-5 text-cyan-500 group-hover:animate-spin" />
                            {t.cta.button}
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-white pt-16 pb-8 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <img
                            src="https://i.imgur.com/Ntmpj8g.png"
                            alt="Creatye"
                            className="h-8 w-auto opacity-70 grayscale hover:grayscale-0 transition-all"
                        />
                        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
                            <a href="#features" className="hover:text-cyan-600 transition-colors">{t.nav.features}</a>
                            <Link href="/privacy" className="hover:text-cyan-600 transition-colors">{t.footer.privacy}</Link>
                            <Link href="/terms" className="hover:text-cyan-600 transition-colors">{t.footer.terms}</Link>
                        </div>
                    </div>
                    <div className="text-center text-xs text-slate-400 border-t border-slate-50 pt-8">
                        © {new Date().getFullYear()} {t.footer.rights}
                    </div>
                </div>
            </footer>
        </div>
    )
}
