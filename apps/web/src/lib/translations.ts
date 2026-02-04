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
            success: "Sucesso"
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
            success: "Success"
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
        }
    }
};

export type TranslationKey = keyof typeof translations.pt;
