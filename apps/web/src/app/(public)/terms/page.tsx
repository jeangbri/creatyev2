export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 py-20 px-6">
            <div className="max-w-3xl mx-auto prose prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-ul:text-slate-600">
                <h1 className="text-3xl font-extrabold mb-8">Termos de Serviço – Creatye</h1>

                <p>A Creatye é uma plataforma de automação para Instagram que permite a gestão de mensagens, comentários e interações de forma automatizada. Ao utilizar nossos serviços, você concorda com os termos descritos abaixo.</p>

                <h3>1. Dados coletados</h3>
                <p>Coletamos apenas os dados necessários para o funcionamento das automações, que podem incluir:</p>
                <ul>
                    <li>Identificador da conta do Instagram (User ID)</li>
                    <li>Nome de usuário</li>
                    <li>Foto de perfil</li>
                    <li>Tokens de acesso autorizados pelo usuário</li>
                    <li>Mensagens recebidas via Instagram Direct</li>
                    <li>Comentários públicos</li>
                    <li>Logs de automações e interações</li>
                </ul>
                <p><strong>Não coletamos senhas do Instagram.</strong></p>

                <h3>2. Finalidade do uso</h3>
                <p>Os dados são utilizados exclusivamente para:</p>
                <ul>
                    <li>Execução de automações configuradas pelo usuário</li>
                    <li>Respostas automáticas a mensagens e comentários</li>
                    <li>Registro de atividades e logs</li>
                    <li>Manutenção da plataforma</li>
                </ul>
                <p>Os dados não são vendidos nem utilizados para publicidade.</p>

                <h3>3. Compartilhamento</h3>
                <p>Os dados podem ser processados por provedores de infraestrutura responsáveis pela operação do sistema, como serviços de hospedagem em nuvem e banco de dados. Esses provedores atuam apenas sob instruções da Creatye e seguem padrões de segurança.</p>

                <h3>4. Armazenamento e segurança</h3>
                <p>Os dados são armazenados em ambientes de nuvem protegidos por controles de acesso, criptografia e medidas de segurança adequadas para evitar acesso não autorizado.</p>

                <h3>5. Retenção</h3>
                <p>Os dados são mantidos apenas enquanto a conta estiver conectada à plataforma. O usuário pode remover a integração a qualquer momento.</p>

                <h3>6. Exclusão de dados</h3>
                <p>O usuário pode solicitar a exclusão dos dados enviando um e-mail para: <a href="mailto:contatocreatye@gmail.com" className="text-cyan-600 font-medium">contatocreatye@gmail.com</a>. A solicitação será processada conforme as normas aplicáveis.</p>

                <h3>7. Direitos do usuário</h3>
                <p>O usuário pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento.</p>

                <h3>8. Atualizações</h3>
                <p>Esta política pode ser atualizada periodicamente para refletir melhorias no serviço.</p>
            </div>
        </div>
    )
}
