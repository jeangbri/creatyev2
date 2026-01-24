import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, Tag, HelpCircle, GripVertical } from "lucide-react";

export function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 border-r bg-white h-full flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-slate-800">Blocos</h3>
                <p className="text-xs text-slate-500">Arraste para adicionar</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Message Block */}
                <div
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-blue-400 hover:shadow-sm transition-all group"
                    onDragStart={(event) => onDragStart(event, 'instagram')}
                    draggable
                >
                    <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Mensagem</p>
                        <p className="text-[10px] text-slate-400">Enviar texto/mídia</p>
                    </div>
                </div>

                {/* Delay Block */}
                <div
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-blue-400 hover:shadow-sm transition-all group"
                    onDragStart={(event) => onDragStart(event, 'delay')}
                    draggable
                >
                    <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
                        <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Aguardar</p>
                        <p className="text-[10px] text-slate-400">Delay temporal</p>
                    </div>
                </div>

                {/* Tag Block */}
                <div
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-blue-400 hover:shadow-sm transition-all group"
                    onDragStart={(event) => onDragStart(event, 'tag')}
                    draggable
                >
                    <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md">
                        <Tag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Tags</p>
                        <p className="text-[10px] text-slate-400">Adicionar/Remover</p>
                    </div>
                </div>

                {/* Condition Block */}
                <div
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-blue-400 hover:shadow-sm transition-all group"
                    onDragStart={(event) => onDragStart(event, 'condition')}
                    draggable
                >
                    <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                    <div className="p-2 bg-cyan-100 text-cyan-600 rounded-md">
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">Condicional</p>
                        <p className="text-[10px] text-slate-400">Sim ou Não</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t text-center">
                <p className="text-xs text-slate-400">Creatye Flow Builder v2.0</p>
            </div>
        </aside>
    );
}
