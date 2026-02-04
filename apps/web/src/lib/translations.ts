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
            switchLanguage: "Mudar idioma"
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
            switchLanguage: "Switch language"
        }
    }
};

export type TranslationKey = keyof typeof translations.pt;
