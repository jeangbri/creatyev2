"use client"

import { useState } from 'react';
import { Plus, MessageSquare, Pencil, Trash2, Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/language-context";

interface Template {
    id: string;
    name: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

interface ResponsesViewProps {
    templates: Template[];
}

export function ResponsesView({ templates: initial }: ResponsesViewProps) {
    const { t } = useLanguage();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [body, setBody] = useState('');
    const [saving, setSaving] = useState(false);

    const filtered = initial.filter(tpl =>
        tpl.name.toLowerCase().includes(search.toLowerCase()) ||
        tpl.body.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setName('');
        setBody('');
    };

    const handleEdit = (tpl: Template) => {
        setEditingId(tpl.id);
        setName(tpl.name);
        setBody(tpl.body);
        setShowForm(true);
    };

    const handleSave = async () => {
        if (!name.trim() || !body.trim()) {
            toast.error('Preencha nome e conteúdo.');
            return;
        }
        setSaving(true);
        try {
            const url = editingId ? `/api/responses/${editingId}` : '/api/responses';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), body: body.trim() }),
            });
            if (!res.ok) throw new Error();
            toast.success(editingId ? 'Resposta atualizada!' : 'Resposta criada!');
            resetForm();
            router.refresh();
        } catch {
            toast.error('Erro ao salvar resposta.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/responses/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            toast.success('Resposta excluída!');
            router.refresh();
        } catch {
            toast.error('Erro ao excluir.');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copiado!');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Respostas Rápidas</h1>
                    <p className="mt-1 text-sm text-slate-400">Templates de resposta para suas automações.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-4 text-[13px] font-medium gap-1.5"
                >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Nova resposta
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                        {editingId ? 'Editar resposta' : 'Nova resposta'}
                    </h3>
                    <div className="space-y-3">
                        <Input
                            placeholder="Nome do template (ex: Boas-vindas)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-9 text-[13px] rounded-lg border-slate-200"
                        />
                        <textarea
                            placeholder="Conteúdo da resposta..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0 resize-none"
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={resetForm} className="h-9 text-[13px] rounded-lg">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg h-9 px-4 text-[13px] font-medium"
                        >
                            {saving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Search */}
            {initial.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input
                        placeholder="Buscar respostas..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-9 text-[13px] rounded-lg border-slate-200 bg-white"
                    />
                </div>
            )}

            {/* List */}
            {filtered.length === 0 && !showForm ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-dashed border-slate-200 bg-white">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                        <MessageSquare className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Nenhuma resposta</p>
                    <p className="text-[13px] text-slate-400 text-center max-w-[280px]">
                        Crie templates de resposta para usar nas suas automações.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((tpl) => (
                        <div
                            key={tpl.id}
                            className="group bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 p-4 transition-colors duration-200"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-[13px] font-semibold text-slate-900 truncate">{tpl.name}</h3>
                                    <p className="text-[12px] text-slate-400 mt-1 line-clamp-2 whitespace-pre-wrap">{tpl.body}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button
                                        onClick={() => handleCopy(tpl.body)}
                                        className="p-1.5 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-50"
                                        title="Copiar"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(tpl)}
                                        className="p-1.5 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-50"
                                        title="Editar"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Excluir resposta?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem certeza? Essa ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(tpl.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    Excluir
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
