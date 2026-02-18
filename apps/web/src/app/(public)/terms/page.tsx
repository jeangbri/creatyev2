import Link from 'next/link'
import { ArrowLeft, TextSelect, FileText, CheckCircle2 } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-cyan-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Voltar para Home</span>
                    </Link>
                    <img
                        src="https://i.imgur.com/Ntmpj8g.png"
                        alt="Creatye"
                        className="h-6 w-auto opacity-80"
                    />
                </div>
            </div>

            {/* Content Wrapper */}
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                {/* Hero Section */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-6 text-indigo-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Termos de Serviço
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Ao utilizar nossos serviços, você aceita as condições e termos descritos abaixo.
                    </p>
                </div>

                {/* Terms Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 hover:prose-a:text-indigo-600 prose-a:font-semibold prose-strong:text-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                    <div className="flex items-start gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-8">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-indigo-900 font-bold m-0 mb-1">Visão Geral</h4>
                            <p className="text-indigo-700 text-sm m-0">
                                A Creatye é uma plataforma de automação para Instagram que permite a gestão de mensagens, comentários e interações de forma automatizada. Ao utilizar nossos serviços, você concorda inteiramente com estes termos.
                            </p>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2">1. Coleta e Uso de Dados</h3>
                    <p>Coletamos apenas os dados necessários para o funcionamento das automações. Isso inclui ID da conta, nome de usuário, foto e logs de interações. <strong>Nunca</strong> coletamos senhas.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2">2. Finalidade</h3>
                    <p>Os dados são usados exclusivamente para executar as automações que você configurou (respostas, mensagens, comentários) e para manutenção do sistema. Seus dados não são vendidos.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2">3. Segurança e Infraestrutura</h3>
                    <p>Utilizamos servidores em nuvem seguros e criptografados. Podemos compartilhar dados com infraestrutura (como AWS/Google Cloud) apenas para operação do serviço, nunca para fins comerciais de terceiros.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2">4. Retenção e Exclusão</h3>
                    <p>
                        Mantemos seus dados apenas enquanto sua conta estiver ativa. Você pode solicitar a exclusão completa a qualquer momento enviando um email para <a href="mailto:contatocreatye@gmail.com">contatocreatye@gmail.com</a>.
                    </p>

                    <h3 className="text-xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2">5. Seus Direitos</h3>
                    <p>Você tem total direito de solicitar acesso, correção ou exclusão de seus dados. Esta política e termos podem ser atualizados para refletir melhorias no serviço.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4 border-b border-slate-100 pb-2">6. Contato</h3>
                    <p>
                        Para qualquer dúvida sobre estes termos, entre em contato pelo email: <a href="mailto:contatocreatye@gmail.com" className="text-indigo-600 font-semibold no-underline hover:underline">contatocreatye@gmail.com</a>.
                    </p>
                </div>

                <div className="mt-12 text-center pt-8 border-t border-slate-200">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                        Documento atualizado em {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    )
}
