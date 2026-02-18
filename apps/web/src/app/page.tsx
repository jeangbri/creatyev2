"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    ChevronDown,
    Lock,
    Globe,
    HelpCircle,
    Plus,
    Minus
} from 'lucide-react'

// FAQ Component
function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-5 text-left group"
            >
                <span className="text-base font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors">
                    {question}
                </span>
                <span className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-cyan-50 rotate-180' : 'bg-slate-50'}`}>
                    {isOpen ? (
                        <Minus className="w-4 h-4 text-cyan-600" />
                    ) : (
                        <Plus className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
                    )}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-sm text-slate-500 leading-relaxed pr-8">
                    {answer}
                </p>
            </div>
        </div>
    )
}

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-cyan-100 font-sans">
            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${isScrolled
                ? 'bg-white/90 backdrop-blur-md border-slate-100 shadow-sm'
                : 'bg-transparent border-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://i.imgur.com/Ntmpj8g.png"
                            alt="Creatye"
                            className="h-8 w-auto"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">
                            Funcionalidades
                        </a>
                        <a href="#security" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">
                            Segurança
                        </a>
                        <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors">
                            Perguntas Frequentes
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/entrar"
                            className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/registrar"
                            className="text-sm font-bold text-white bg-slate-900 hover:bg-cyan-600 px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5"
                        >
                            Começar Grátis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ HERO ═══ */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
                {/* Background Decor */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-cyan-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="flex relative h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Nova versão disponível 2.0
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Automação Inteligente para <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-text-gradient">
                            Instagram Direct & Stories
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        A plataforma oficial para escalar suas conversas. Responda directs,
                        comentários e menções automaticamente, 24 horas por dia, com segurança total.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link
                            href="/registrar"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-bold text-white bg-slate-900 hover:bg-cyan-600 px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-cyan-500/30 hover:-translate-y-1"
                        >
                            Criar Conta Gratuita
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="#how-it-works"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-8 py-4 rounded-full transition-all duration-300"
                        >
                            Ver demonstração
                        </a>
                    </div>
                </div>
            </section>

            {/* ═══ TRUST & SECURITY ═══ */}
            <section id="security" className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                            Segurança de nível bancário • Parceiro Oficial
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Shield className="w-8 h-8 text-cyan-600" />,
                                title: "API Oficial Meta",
                                desc: "Utilizamos apenas a API oficial do Instagram/Meta. Sem riscos de bloqueio por automação indevida."
                            },
                            {
                                icon: <Lock className="w-8 h-8 text-cyan-600" />,
                                title: "Criptografia E2E",
                                desc: "Todos os tokens e dados sensíveis são criptografados com padrões militares (AES-256)."
                            },
                            {
                                icon: <Globe className="w-8 h-8 text-cyan-600" />,
                                title: "Infraestrutura Cloud",
                                desc: "Não precisa deixar PC ligado. Tudo roda 100% na nuvem, 24/7, com alta disponibilidade."
                            },
                            {
                                icon: <CheckCircle2 className="w-8 h-8 text-cyan-600" />,
                                title: "Conformidade LGPD",
                                desc: "Respeitamos sua privacidade e a de seus clientes. Seus dados não são vendidos."
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="mb-4 p-3 bg-cyan-50 rounded-xl">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES GRID ═══ */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                            Tudo que você precisa para <br />
                            <span className="text-cyan-600">vender no automático</span>
                        </h2>
                        <p className="text-lg text-slate-500">
                            Substitua horas de trabalho manual por fluxos inteligentes que respondem seus clientes instantaneamente.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-cyan-100/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare className="w-24 h-24 text-cyan-600" />
                            </div>
                            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 transition-colors duration-500">
                                <MessageSquare className="w-7 h-7 text-cyan-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Resposta de Direct (DM)</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Configure palavras-chave como "PREÇO" ou "QUERO" e envie respostas completas com links, áudios e carrosséis instantaneamente.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Instagram className="w-24 h-24 text-pink-600" />
                            </div>
                            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-500">
                                <Instagram className="w-7 h-7 text-pink-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Menções em Stories</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Quando alguém te marcar no story, o Creatye agradece automaticamente e pode até enviar um cupom de desconto no direct.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MousePointerClick className="w-24 h-24 text-amber-500" />
                            </div>
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-500">
                                <MousePointerClick className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Comentários no Feed</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Transforme comentários em vendas. Responda o comentário publicamente e chame o cliente no direct com a oferta.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap className="w-24 h-24 text-emerald-500" />
                            </div>
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-500">
                                <Zap className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Editor Visual de Fluxos</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Crie funis complexos arrastando e soltando blocos. Adicione delays, condições e tags sem escrever uma linha de código.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users className="w-24 h-24 text-indigo-500" />
                            </div>
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors duration-500">
                                <Users className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">CRM Integrado</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Gerencie seus leads, adicione etiquetas (tags) automáticas e saiba exatamente em qual etapa do funil cada cliente está.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BarChart3 className="w-24 h-24 text-slate-800" />
                            </div>
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-800 transition-colors duration-500">
                                <BarChart3 className="w-7 h-7 text-slate-800 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Analytics em Tempo Real</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Acompanhe quantas mensagens foram enviadas, qual a taxa de resposta e otimize seus fluxos com dados reais.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS (Timeline) ═══ */}
            <section id="how-it-works" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                            Comece em 3 passos simples
                        </h2>
                    </div>

                    <div className="relative grid md:grid-cols-3 gap-12">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[2.5rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-200 via-cyan-200 to-slate-200 z-0" />

                        {[
                            { step: 1, title: "Conecte sua conta", desc: "Faça login com seu Facebook/Instagram. A conexão é oficial e segura." },
                            { step: 2, title: "Crie o fluxo", desc: "Defina a palavra-chave (ex: 'QUERO') e desenhe a resposta no editor." },
                            { step: 3, title: "Ative e venda", desc: "Publique a automação. O Creatye responde todo mundo instantaneamente." }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex items-center justify-center text-2xl font-black text-cyan-600 mb-6 group hover:border-cyan-500 hover:scale-110 transition-all duration-300">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed max-w-xs">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FAQ SECTION ═══ */}
            <section id="faq" className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Perguntas Frequentes
                        </h2>
                        <p className="text-slate-500">
                            Tire suas dúvidas sobre a plataforma Creatye
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 p-8 md:p-12">
                        <div className="space-y-2">
                            <FAQItem
                                question="Minha conta corre risco de bloqueio?"
                                answer="Não. O Creatye utiliza a API Oficial do Instagram (Meta Business Partners). Diferente de robôs antigos que simulavam cliques, nossa integração é aprovada e segura, seguindo todas as políticas da Meta."
                            />
                            <FAQItem
                                question="Preciso deixar meu computador ligado?"
                                answer="Não! O Creatye é 100% em nuvem. Uma vez configurada, sua automação funciona 24 horas por dia, 7 dias por semana, mesmo que você esteja sem internet ou com o celular desligado."
                            />
                            <FAQItem
                                question="Funciona para perfil pessoal?"
                                answer="Não. Devido às limitações da API do Instagram, o Creatye funciona apenas para contas Comerciais (Business) ou de Criador de Conteúdo vinculadas a uma Página do Facebook."
                            />
                            <FAQItem
                                question="Posso testar antes de assinar?"
                                answer="Com certeza! Oferecemos um plano gratuito para você começar e testar as principais funcionalidades sem compromisso."
                            />
                            <FAQItem
                                question="Como funciona o suporte?"
                                answer="Temos uma equipe de suporte dedicada via e-mail e chat para te ajudar a configurar seus primeiros fluxos e tirar qualquer dúvida técnica."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA SECTION ═══ */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/30 rounded-full blur-[120px]" />

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8">
                        Comece a automatizar hoje.
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Junte-se a milhares de empreendedores que já economizam tempo e vendem mais com o Creatye.
                    </p>

                    <Link
                        href="/registrar"
                        className="inline-flex items-center gap-3 text-lg font-bold text-slate-900 bg-white hover:bg-cyan-50 px-10 py-5 rounded-full transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-1"
                    >
                        Criar Conta Gratuita Agora
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400 font-medium">
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Sem cartão de crédito
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Setup instantâneo
                        </span>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <img
                                src="https://i.imgur.com/Ntmpj8g.png"
                                alt="Creatye"
                                className="h-7 w-auto mb-6 opacity-80"
                            />
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Plataforma de automação inteligente para Instagram. Escale suas vendas e atendimento com segurança.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Plataforma</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><a href="#features" className="hover:text-cyan-600 transition-colors">Funcionalidades</a></li>
                                <li><a href="#how-it-works" className="hover:text-cyan-600 transition-colors">Como Funciona</a></li>
                                <li><Link href="/entrar" className="hover:text-cyan-600 transition-colors">Login</Link></li>
                                <li><Link href="/registrar" className="hover:text-cyan-600 transition-colors">Criar Conta</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><Link href="/privacy" className="hover:text-cyan-600 transition-colors">Política de Privacidade</Link></li>
                                <li><Link href="/terms" className="hover:text-cyan-600 transition-colors">Termos de Uso</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Contato</h4>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li><a href="mailto:contatocreatye@gmail.com" className="hover:text-cyan-600 transition-colors">contatocreatye@gmail.com</a></li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Sistemas Operacionais
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-400 font-medium">
                            © {new Date().getFullYear()} Creatye. Todos os direitos reservados.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons could go here */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
