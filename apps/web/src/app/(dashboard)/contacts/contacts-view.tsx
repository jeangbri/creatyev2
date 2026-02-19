"use client"

import { useState } from 'react';
import { Users, Search, ExternalLink, Instagram } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Contact {
    id: string;
    instagramId: string;
    username: string | null;
    fullName: string | null;
    profilePicUrl: string | null;
    isVerified: boolean;
    isFollowing: boolean;
    followerCount: number;
    lastInteraction: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

interface ContactsViewProps {
    contacts: Contact[];
}

export function ContactsView({ contacts }: ContactsViewProps) {
    const [search, setSearch] = useState('');

    const filtered = contacts.filter(c =>
        (c.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.fullName || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Contatos</h1>
                <p className="mt-1 text-sm text-slate-400">
                    Pessoas que interagiram com suas automações.
                    {contacts.length > 0 && <span className="ml-1">({contacts.length})</span>}
                </p>
            </div>

            {contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-slate-200 bg-white">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Nenhum contato</p>
                    <p className="text-[13px] text-slate-400 text-center max-w-[300px]">
                        Quando alguém interagir com suas automações, os contatos aparecerão aqui automaticamente.
                    </p>
                </div>
            ) : (
                <>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input
                            placeholder="Buscar contatos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 text-[13px] rounded-lg border-slate-200 bg-white"
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Contato</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Seguidores</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Status</th>
                                    <th className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Tags</th>
                                    <th className="text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Última interação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((contact) => (
                                    <tr key={contact.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-100">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {contact.profilePicUrl ? (
                                                    <img
                                                        src={contact.profilePicUrl}
                                                        alt=""
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <span className="text-[11px] font-bold text-slate-400">
                                                            {(contact.username || contact.fullName || '?')[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[13px] font-medium text-slate-900 truncate">
                                                            {contact.username ? `@${contact.username}` : contact.fullName || 'Sem nome'}
                                                        </span>
                                                        {contact.isVerified && (
                                                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">✓</span>
                                                        )}
                                                    </div>
                                                    {contact.fullName && contact.username && (
                                                        <p className="text-[11px] text-slate-400 truncate">{contact.fullName}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-[12px] text-slate-500 tabular-nums">
                                                {contact.followerCount.toLocaleString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${contact.isFollowing
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-slate-50 text-slate-400'
                                                }`}>
                                                {contact.isFollowing ? 'Seguindo' : 'Não segue'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <div className="flex gap-1 flex-wrap">
                                                {contact.tags.length > 0 ? contact.tags.map((tag, i) => (
                                                    <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                                                        {tag}
                                                    </span>
                                                )) : (
                                                    <span className="text-[11px] text-slate-300">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-[11px] text-slate-400">
                                                {formatDistanceToNow(new Date(contact.lastInteraction), { addSuffix: true, locale: ptBR })}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="py-12 text-center text-sm text-slate-300">
                                Nenhum contato encontrado.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
