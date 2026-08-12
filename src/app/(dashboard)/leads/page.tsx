import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStageSelect } from "./lead-stage-select";
import { LeadStage } from "@prisma/client";

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

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const leads = await prisma.lead.findMany({
    where: {
      userId: user.id,
    },
    include: {
      client: true,
      property: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Funil de Vendas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe e mova seus leads pelo processo
          </p>
        </div>
        <Link href="/leads/novo">
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </Link>
      </header>
      
      {/* Kanban Board - Scroll Horizontal */}
      <div className="flex-1 overflow-x-auto pb-6 flex gap-6 snap-x snap-mandatory min-h-[600px] scrollbar-thin scrollbar-thumb-slate-300">
        {STAGES.map((stage) => {
          const columnLeads = leads.filter(l => l.stage === stage.value);
          
          return (
            <div key={stage.value} className="w-[320px] shrink-0 flex flex-col snap-center bg-slate-100/50 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-slate-200/60 bg-white/60 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.dotColor} shadow-sm`} />
                  <span className="font-semibold text-sm text-slate-700 tracking-wide">{stage.label}</span>
                </div>
                <span className="bg-slate-200/70 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {columnLeads.length}
                </span>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {columnLeads.map((lead) => (
                  <Card key={lead.id} className="shadow-sm border-slate-200/70 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing bg-white/90">
                    <CardContent className="p-4">
                      <div className="font-semibold text-sm text-slate-800 mb-1 line-clamp-1">
                        {lead.client ? lead.client.name : 'Cliente Não Informado'}
                      </div>
                      
                      {lead.property && (
                        <div className="text-xs text-slate-500 truncate mb-3 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {lead.property.title}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                          {lead.origin}
                        </span>
                      </div>

                      <div className="mt-3">
                        <LeadStageSelect leadId={lead.id} initialStage={lead.stage} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnLeads.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 mt-2">
                    <span className="text-xs font-medium text-slate-400">Nenhum lead</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
