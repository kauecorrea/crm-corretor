"use client";

import { useState, useTransition } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable, closestCorners } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStageSelect } from "./lead-stage-select";
import { updateLeadStageAction } from "./actions";

const STAGES = [
  { value: "NEW", label: "Novo Lead", dotColor: "bg-blue-500" },
  { value: "CONTACTED", label: "Contatado", dotColor: "bg-indigo-500" },
  { value: "VISIT_SCHEDULED", label: "Visita Agend.", dotColor: "bg-yellow-500" },
  { value: "VISIT_DONE", label: "Visita Realiz.", dotColor: "bg-orange-500" },
  { value: "PROPOSAL", label: "Proposta", dotColor: "bg-purple-500" },
  { value: "NEGOTIATION", label: "Negociação", dotColor: "bg-pink-500" },
  { value: "WON", label: "Ganho", dotColor: "bg-emerald-500" },
  { value: "LOST", label: "Perdido", dotColor: "bg-slate-400" },
];

function KanbanColumn({ stage, leads, children }: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: stage.value,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`w-[320px] shrink-0 flex flex-col snap-center rounded-2xl border shadow-sm overflow-hidden transition-colors ${isOver ? 'bg-primary/5 border-primary/40' : 'bg-slate-100/50 border-slate-200/60'}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-200/60 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${stage.dotColor} shadow-sm`} />
          <span className="font-semibold text-sm text-slate-700 tracking-wide">{stage.label}</span>
        </div>
        <span className="bg-slate-200/70 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
          {leads.length}
        </span>
      </div>
      <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]">
        {children}
        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 mt-2">
            <span className="text-xs font-medium text-slate-400">Arraste para cá</span>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanCard({ lead, onSelect, onStageChange }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: { stage: lead.stage }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : undefined,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      style={style}
      onClick={() => {
        if (!isDragging) {
          onSelect(lead);
        }
      }}
      className="shadow-sm border-slate-200/70 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing bg-white/90 relative group"
    >
      <CardContent className="p-4">
        <div className="font-semibold text-sm text-slate-800 mb-1 line-clamp-1 pointer-events-none">
          {lead.client ? lead.client.name : 'Cliente Não Informado'}
        </div>
        
        {lead.property && (
          <div className="text-xs text-slate-500 truncate mb-3 flex items-center gap-1.5 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            {lead.property.title}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 pointer-events-none">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
            {lead.origin}
          </span>
          {lead.client?.interactions?.length > 0 && (
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              {lead.client.interactions.length} Follow-ups
            </span>
          )}
        </div>

        {/* Prevent dragging when interacting with select */}
        <div className="mt-3 cursor-default" onPointerDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
          <LeadStageSelect leadId={lead.id} initialStage={lead.stage} onStageChange={onStageChange} />
        </div>
      </CardContent>
    </Card>
  );
}

import { LeadModal } from "./lead-modal";
import { useEffect } from "react";

export function KanbanBoard({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [isPending, startTransition] = useTransition();
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) return;
    
    const leadId = active.id as string;
    const newStage = over.id as string;
    const currentStage = active.data.current?.stage;

    if (newStage === currentStage) return;

    // Optimistic update
    setLeads(current => 
      current.map(l => l.id === leadId ? { ...l, stage: newStage } : l)
    );

    startTransition(async () => {
      await updateLeadStageAction(leadId, newStage);
    });
  }

  const handleStageChange = (leadId: string, newStage: string) => {
    setLeads(current => 
      current.map(l => l.id === leadId ? { ...l, stage: newStage } : l)
    );
  };

  return (
    <>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto pb-6 flex gap-6 snap-x snap-mandatory min-h-[600px] scrollbar-thin scrollbar-thumb-slate-300">
          {STAGES.map(stage => {
            const columnLeads = leads.filter(l => l.stage === stage.value);
            return (
              <KanbanColumn key={stage.value} stage={stage} leads={columnLeads}>
                {columnLeads.map(lead => (
                  <KanbanCard key={lead.id} lead={lead} onSelect={setSelectedLead} onStageChange={(newStage: string) => handleStageChange(lead.id, newStage)} />
                ))}
              </KanbanColumn>
            );
          })}
        </div>
      </DndContext>
      
      <LeadModal 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />
    </>
  );
}
