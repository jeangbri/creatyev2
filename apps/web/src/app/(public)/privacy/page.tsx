import Link from 'next/link'
import { ArrowLeft, Shield, Lock } from 'lucide-react'

export default function PrivacyPage() {
    const lastUpdate = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-cyan-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
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
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl mb-6 text-cyan-600">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Política de Privacidade
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Sua privacidade é nossa prioridade. Entenda como coletamos, usamos e protegemos seus dados.
                    </p>
                    <p className="text-xs text-slate-400 mt-4 uppercase tracking-wider font-semibold">
                        Atualizado em: {lastUpdate}
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 hover:prose-a:text-cyan-600 prose-a:font-semibold prose-strong:text-slate-800">

                    <p className="lead text-lg text-slate-700">
                        A <strong>Creatye</strong> é uma plataforma de automação para Instagram que permite a gestão de mensagens, comentários e interações de forma automatizada.
                    </p>

                    <h3 className="flex items-center gap-3 mt-8">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 text-sm font-bold">1</span>
                        Dados coletados
                    </h3>
                    <p>Coletamos apenas os dados necessários para o funcionamento das automações, que podem incluir:</p>
                    <ul className="grid sm:grid-cols-2 gap-2 mt-4 ml-0 list-none pl-0">
                        {[
                            'Identificador da conta (User ID)',
                            'Nome de usuário',
                            'Foto de perfil',
                            'Tokens de acesso autorizados',
                            'Mensagens recebidas via Direct',
                            'Comentários públicos',
                            'Logs de automações'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-3 bg-red-50 text-red-800 p-4 rounded-xl mt-6 border border-red-100">
                        <Lock className="w-5 h-5 flex-shrink-0" />
                        <p className="m-0 text-sm font-semibold">Não coletamos senhas do Instagram.</p>
                    </div>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 text-sm font-bold">2</span>
                        Finalidade do uso
                    </h3>
                    <p>Os dados são utilizados exclusivamente para:</p>
                    <ul>
                        <li>Execução de automações configuradas pelo usuário</li>
                        <li>Respostas automáticas a mensagens e comentários</li>
                        <li>Registro de atividades e logs</li>
                        <li>Manutenção da plataforma</li>
                    </ul>
                    <p className="italic bg-slate-50 p-4 text-center rounded-xl border border-dashed border-slate-200 text-slate-500">
                        "Os dados não são vendidos nem utilizados para publicidade."
                    </p>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 text-sm font-bold">3</span>
                        Compartilhamento
                    </h3>
                    <p>Os dados podem ser processados por provedores de infraestrutura responsáveis pela operação do sistema, como serviços de hospedagem em nuvem e banco de dados. Esses provedores atuam apenas sob instruções da Creatye e seguem padrões de segurança.</p>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 text-sm font-bold">4</span>
                        Armazenamento e segurança
                    </h3>
                    <p>Os dados são armazenados em ambientes de nuvem protegidos por controles de acesso, criptografia e medidas de segurança adequadas para evitar acesso não autorizado.</p>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 text-sm font-bold">5</span>
                        Retenção
                    </h3>
                    <p>Os dados são mantidos apenas enquanto a conta estiver conectada à plataforma. O usuário pode remover a integração a qualquer momento.</p>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 text-sm font-bold">6</span>
                        Exclusão de dados
                    </h3>
                    <p>
                        O usuário pode solicitar a exclusão dos dados enviando um e-mail para: <a href="mailto:contatocreatye@gmail.com">contatocreatye@gmail.com</a>. A solicitação será processada conforme as normas aplicáveis.
                    </p>

                    <h3 className="flex items-center gap-3 mt-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-900 text-sm font-bold">7</span>
                        Direitos do usuário & Atualizações
                    </h3>
                    <p>O usuário pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento. Esta política pode ser atualizada periodicamente para refletir melhorias no serviço.</p>
                </div>

                <div className="mt-12 text-center border-t border-slate-200 pt-8">
                    <p className="text-sm text-slate-400">
                        Dúvidas? Entre em contato pelo e-mail <a href="mailto:contatocreatye@gmail.com" className="text-cyan-600 hover:underline">contatocreatye@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    )
}
