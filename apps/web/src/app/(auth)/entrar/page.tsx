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
        <div className="space-y-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="relative w-24 h-24 bg-white/[0.03] rounded-[2px] p-6 border border-white/5 overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                        src="https://i.imgur.com/Ntmpj8g.png"
                        alt="Creatye Logo"
                        className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
            </div>

            <Card className="rounded-[2px] border-white/5 bg-white/[0.01] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                {/* Top Border Highlight */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <CardHeader className="space-y-1.5 text-center pt-8">
                    <CardTitle className="text-xl font-light tracking-tight text-white/90">
                        Bem-vindo ao <span className="font-bold text-white">Creatye</span>
                    </CardTitle>
                    <CardDescription className="text-zinc-500 text-[10px] uppercase tracking-[0.25em] font-medium">
                        Inteligência em Automacão
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-4 px-8 pb-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 group/input">
                            <label htmlFor="email" className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold ml-1 transition-colors group-focus-within/input:text-white">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within/input:text-cyan-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-black/40 border-white/[0.05] rounded-[2px] pl-10 h-10 text-sm text-white placeholder:text-zinc-700 focus:border-cyan-500/40 focus:ring-0 transition-all duration-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group/input">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold ml-1 transition-colors group-focus-within/input:text-white">
                                    Senha
                                </label>
                                <Link href="#" className="text-[9px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors font-semibold">
                                    Esqueceu?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 transition-colors group-focus-within/input:text-cyan-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-black/40 border-white/[0.05] rounded-[2px] pl-10 h-10 text-sm text-white placeholder:text-zinc-700 focus:border-cyan-500/40 focus:ring-0 transition-all duration-500"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-cyan-500 hover:text-white rounded-[2px] h-11 transition-all duration-500 group font-bold text-xs uppercase tracking-widest"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    Entrando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Acessar Conta
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col items-center justify-center pb-8 pt-0 space-y-4">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                    <p className="text-[10px] text-zinc-600 tracking-wide font-medium">
                        Não possui acesso?
                        <Link href="/registrar" className="text-white hover:text-cyan-400 ml-2 transition-colors font-bold uppercase tracking-widest">
                            Solicitar Convite
                        </Link>
                    </p>
                </CardFooter>
            </Card>

            <p className="text-[9px] text-center text-zinc-700 uppercase tracking-[0.4em] font-medium opacity-40">
                © 2026 Creatye. Precision Software.
            </p>
        </div>
    )
}
