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
  { value: "NEW", label: "Novo Lead", color: "bg-blue-100 border-blue-200" },
  { value: "CONTACTED", label: "Contatado", color: "bg-indigo-100 border-indigo-200" },
  { value: "VISIT_SCHEDULED", label: "Visita Agend.", color: "bg-yellow-100 border-yellow-200" },
  { value: "VISIT_DONE", label: "Visita Realiz.", color: "bg-orange-100 border-orange-200" },
  { value: "PROPOSAL", label: "Proposta", color: "bg-purple-100 border-purple-200" },
  { value: "NEGOTIATION", label: "Negociação", color: "bg-pink-100 border-pink-200" },
  { value: "WON", label: "Ganho", color: "bg-green-100 border-green-200" },
  { value: "LOST", label: "Perdido", color: "bg-red-100 border-red-200" },
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
    <div className="flex flex-col h-[100dvh] bg-muted/20">
      <header className="flex items-center justify-between p-4 bg-background border-b shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funil de Vendas</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe seus leads
          </p>
        </div>
        <Link href="/leads/novo">
          <Button size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      {/* Kanban Board - Scroll Horizontal */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 flex gap-4 snap-x snap-mandatory">
        {STAGES.map((stage) => {
          const columnLeads = leads.filter(l => l.stage === stage.value);
          
          return (
            <div key={stage.value} className="w-[85vw] max-w-[300px] shrink-0 flex flex-col snap-center bg-muted/40 rounded-xl border h-full max-h-full">
              <div className={`p-3 border-b rounded-t-xl font-bold flex items-center justify-between ${stage.color}`}>
                <span>{stage.label}</span>
                <span className="bg-white/50 text-black px-2 py-0.5 rounded-full text-xs">{columnLeads.length}</span>
              </div>
              
              <div className="p-2 flex-1 overflow-y-auto space-y-2">
                {columnLeads.map((lead) => (
                  <Card key={lead.id} className="shadow-sm">
                    <CardContent className="p-3">
                      <div className="font-medium text-sm mb-1">
                        {lead.client ? lead.client.name : 'Cliente Não Informado'}
                      </div>
                      
                      {lead.property && (
                        <div className="text-xs text-muted-foreground truncate mb-2">
                          Imóvel: {lead.property.title}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {lead.origin}
                        </span>
                      </div>

                      <LeadStageSelect leadId={lead.id} initialStage={lead.stage} />
                    </CardContent>
                  </Card>
                ))}
                
                {columnLeads.length === 0 && (
                  <div className="text-center p-4 text-xs text-muted-foreground border-2 border-dashed rounded-lg">
                    Nenhum lead
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
