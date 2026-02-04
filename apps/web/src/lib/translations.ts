export type Language = 'pt' | 'en';

export const translations = {
    pt: {
        sidebar: {
            principal: "Principal",
            geral: "Geral",
            automacoes: "Automações",
            respostas: "Respostas",
            leads: "Leads",
            inbox: "Inbox",
            liveChat: "Live Chat",
            ranking: "Ranking",
            contatos: "Contatos",
            comunidade: "Comunidade",
            explorar: "Explorar",
            meusTemplates: "Meus Templates",
            configuracoes: "Configurações",
            integracoes: "Integrações",
            meuPerfil: "Meu Perfil",
            sair: "Sair"
        },
        common: {
            language: "Idioma",
            switchLanguage: "Mudar idioma",
            cancel: "Cancelar",
            delete: "Excluir",
            deleting: "Excluindo...",
            confirmDeleteTitle: "Tem certeza?",
            confirmDeleteDesc: "Esta ação não pode ser desfeita. A automação será excluída permanentemente.",
            error: "Erro",
            success: "Sucesso",
            disconnect: "Desconectar",
            disconnecting: "Desconectando...",
            connected: "Conectado",
            confirmDisconnectTitle: "Desconectar Instagram?",
            confirmDisconnectDesc: "Isso removerá a conexão com o Instagram e pausará todas as automações associadas. Você poderá reconectar a qualquer momento."
        },
        dashboard: {
            title: "Visão Geral",
            activeAutomations: "Automações Ativas",
            totalExecutions: "Execuções Totais",
            sentResponses: "Respostas Enviadas",
            sinceStart: "Desde o início",
            recentActivity: "Atividade Recente",
            noActivity: "Nenhuma atividade recente.",
            graphPlaceholder: "Gráfico de execuções (Em breve)"
        },
        workflows: {
            title: "Minhas Automações",
            subtitle: "Gerencie seus fluxos de resposta automática",
            createButton: "Criar automação",
            emptyState: "Você ainda não tem automações. Crie a primeira!",
            card: {
                noDescription: "Sem descrição",
                channels: "Canais:",
                executions: "Execuções:",
                updatedAt: "Atualizado em:",
                active: "Ativo",
                inactive: "Inativo",
                deletedSuccess: "Automação excluída",
                deleteError: "Erro ao excluir automação"
            }
        },
        auth: {
            login: {
                welcome: "Bem-vindo ao",
                subtitle: "Inteligência em Automação",
                emailLabel: "Email",
                passwordLabel: "Senha",
                forgotPassword: "Esqueceu?",
                submitButton: "Acessar Conta",
                loadingButton: "Entrando...",
                noAccount: "Não possui acesso?",
                requestInvite: "Solicitar Convite",
                success: "Login realizado com sucesso!",
                error: "Erro ao entrar",
                unexpectedError: "Ocorreu um erro inesperado"
            },
            register: {
                welcome: "Comece com o",
                subtitle: "Crie sua conta de automação",
                emailLabel: "Email Profissional",
                passwordLabel: "Senha de Acesso",
                submitButton: "Criar Minha Conta",
                loadingButton: "Criando...",
                alreadyAccount: "Já possui uma conta?",
                loginLink: "Fazer Login",
                success: "Conta criada! Verifique seu email ou faça login.",
                error: "Erro ao registrar",
                unexpectedError: "Ocorreu um erro inesperado"
            },
            footer: "© 2026 Creatye. Precision Software."
        },
        integrations: {
            title: "Integrações",
            subtitle: "Gerencie suas conexões com o Instagram e Facebook.",
            instagram: {
                title: "Instagram",
                description: "Conecte sua conta profissional para automações",
                connectButton: "Conectar com Facebook",
                revalidateButton: "Revalidar conexão",
                disconnectButton: "Desconectar",
                connected: "Conectado"
            }
        }
    },
    en: {
        sidebar: {
            principal: "Main",
            geral: "General",
            automacoes: "Automations",
            respostas: "Responses",
            leads: "Leads",
            inbox: "Inbox",
            liveChat: "Live Chat",
            ranking: "Ranking",
            contatos: "Contacts",
            comunidade: "Community",
            explorar: "Explore",
            meusTemplates: "My Templates",
            configuracoes: "Settings",
            integracoes: "Integrations",
            meuPerfil: "My Profile",
            sair: "Logout"
        },
        common: {
            language: "Language",
            switchLanguage: "Switch language",
            cancel: "Cancel",
            delete: "Delete",
            deleting: "Deleting...",
            confirmDeleteTitle: "Are you sure?",
            confirmDeleteDesc: "This action cannot be undone. The automation will be permanently deleted.",
            error: "Error",
            success: "Success",
            disconnect: "Disconnect",
            disconnecting: "Disconnecting...",
            connected: "Connected",
            confirmDisconnectTitle: "Disconnect Instagram?",
            confirmDisconnectDesc: "This will remove the Instagram connection and pause all associated automations. You can reconnect at any time."
        },
        dashboard: {
            title: "Overview",
            activeAutomations: "Active Automations",
            totalExecutions: "Total Executions",
            sentResponses: "Sent Responses",
            sinceStart: "Since start",
            recentActivity: "Recent Activity",
            noActivity: "No recent activity.",
            graphPlaceholder: "Execution graph (Coming soon)"
        },
        workflows: {
            title: "My Automations",
            subtitle: "Manage your automated response flows",
            createButton: "Create automation",
            emptyState: "You don't have any automations yet. Create your first one!",
            card: {
                noDescription: "No description",
                channels: "Channels:",
                executions: "Executions:",
                updatedAt: "Updated at:",
                active: "Active",
                inactive: "Inactive",
                deletedSuccess: "Automation deleted",
                deleteError: "Error deleting automation"
            }
        },
        auth: {
            login: {
                welcome: "Welcome to",
                subtitle: "Automation Intelligence",
                emailLabel: "Email",
                passwordLabel: "Password",
                forgotPassword: "Forgot?",
                submitButton: "Sign In",
                loadingButton: "Signing in...",
                noAccount: "Don't have access?",
                requestInvite: "Request Invite",
                success: "Login successful!",
                error: "Error signing in",
                unexpectedError: "An unexpected error occurred"
            },
            register: {
                welcome: "Get started with",
                subtitle: "Create your automation account",
                emailLabel: "Professional Email",
                passwordLabel: "Access Password",
                submitButton: "Create My Account",
                loadingButton: "Creating...",
                alreadyAccount: "Already have an account?",
                loginLink: "Sign In",
                success: "Account created! Check your email or sign in.",
                error: "Error registering",
                unexpectedError: "An unexpected error occurred"
            },
            footer: "© 2026 Creatye. Precision Software."
        },
        integrations: {
            title: "Integrations",
            subtitle: "Manage your connections with Instagram and Facebook.",
            instagram: {
                title: "Instagram",
                description: "Connect your professional account for automations",
                connectButton: "Connect with Facebook",
                revalidateButton: "Revalidate connection",
                disconnectButton: "Disconnect",
                connected: "Connected"
            }
        }
    }
};

export type TranslationKey = keyof typeof translations.pt;
