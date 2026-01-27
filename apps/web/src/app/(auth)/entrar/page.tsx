"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Lock, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                toast.error('Erro ao entrar: ' + error.message)
            } else {
                toast.success('Login realizado com sucesso!')
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            toast.error('Ocorreu um erro inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-10">
            {/* Logo Section - Removed Box and Made Larger */}
            <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-4 duration-1000">
                <img
                    src="https://i.imgur.com/Ntmpj8g.png"
                    alt="Creatye Logo"
                    className="w-48 h-auto object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                />
            </div>

            <Card className="rounded-xl border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Accent Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-20" />

                <CardHeader className="space-y-2 text-center pt-8">
                    <CardTitle className="text-2xl font-light tracking-tight text-white">
                        Bem-vindo ao <span className="font-bold">Creatye</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs uppercase tracking-[0.3em] font-semibold">
                        Inteligência em Automacão
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 px-10 pb-10">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2.5 group/input">
                            <label htmlFor="email" className="text-[11px] uppercase tracking-widest text-slate-400 font-bold ml-1 transition-colors group-focus-within/input:text-cyan-400">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 transition-colors group-focus-within/input:text-cyan-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-slate-950/50 border-white/10 rounded-lg pl-12 h-12 text-base text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-0 focus:bg-slate-950/80 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5 group/input">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="password" className="text-[11px] uppercase tracking-widest text-slate-400 font-bold transition-colors group-focus-within/input:text-cyan-400">
                                    Senha
                                </label>
                                <Link href="#" className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors font-bold">
                                    Esqueceu?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 transition-colors group-focus-within/input:text-cyan-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-slate-950/50 border-white/10 rounded-lg pl-12 h-12 text-base text-white placeholder:text-slate-600 focus:border-cyan-500/50 focus:ring-0 focus:bg-slate-950/80 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-white text-slate-950 hover:bg-cyan-500 hover:text-white rounded-lg h-12 transition-all duration-300 group font-bold text-sm uppercase tracking-widest shadow-lg shadow-white/5"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                                    Entrando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Acessar Conta
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col items-center justify-center pb-10 pt-0 space-y-6">
                    <div className="w-full px-10">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    <p className="text-[11px] text-slate-500 tracking-wide font-medium">
                        Não possui acesso?
                        <Link href="/registrar" className="text-white hover:text-cyan-400 ml-2 transition-colors font-bold uppercase tracking-widest border-b border-white/10 pb-0.5">
                            Solicitar Convite
                        </Link>
                    </p>
                </CardFooter>
            </Card>

            <p className="text-[10px] text-center text-slate-600 uppercase tracking-[0.5em] font-bold opacity-60">
                © 2026 Creatye. Precision Software.
            </p>
        </div>
    )
}
