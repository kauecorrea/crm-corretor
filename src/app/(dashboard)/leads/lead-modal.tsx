"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addInteractionAction, addReminderAction } from "@/app/(dashboard)/clientes/actions";
import { MessageSquare, Calendar, Phone, Mail, Building, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeleteLeadButton } from "./delete-lead-button";

export function LeadModal({ 
  lead, 
  isOpen, 
  onClose 
}: { 
  lead: any, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [isPending, setIsPending] = useState(false);

  if (!lead || !lead.client) return null;
  const client = lead.client;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-2xl">{client.name}</SheetTitle>
              <SheetDescription className="text-sm">
                Estágio Atual: <span className="font-semibold text-slate-800">{lead.stage}</span>
                {lead.origin && <span className="ml-2">| Origem: {lead.origin}</span>}
              </SheetDescription>
            </div>
            <DeleteLeadButton id={lead.id} />
          </div>
        </SheetHeader>

        <div className="space-y-8">
          {/* Contato & Imóvel */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> 
                  <a href={`https://wa.me/${client.phone.replace(/\\D/g,'')}`} target="_blank" className="text-emerald-600 hover:underline">{client.phone}</a>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> 
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">{client.email}</a>
                </div>
              )}
              {lead.property && (
                <div className="flex items-center gap-2 font-medium text-slate-800 mt-2">
                  <Building className="w-4 h-4 text-primary" />
                  Imóvel de Interesse: {lead.property.title}
                </div>
              )}
            </div>
          </div>

          {/* Lembretes Pendentes */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2"><Calendar className="h-5 w-5" /> Lembretes</h3>
            
            {client.reminders && client.reminders.length > 0 ? (
              <div className="space-y-2">
                {client.reminders.map((reminder: any) => (
                  <div key={reminder.id} className="text-sm p-3 border rounded-lg bg-yellow-50/50 border-yellow-200 text-yellow-800">
                    <span className="font-bold">{format(new Date(reminder.date), "dd/MM 'às' HH:mm")}</span> - {reminder.description}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Nenhum lembrete pendente.</p>
            )}

            <form action={async (formData) => {
              setIsPending(true);
              await addReminderAction(formData);
              setIsPending(false);
            }} className="flex gap-2 items-end pt-2">
              <input type="hidden" name="clientId" value={client.id} />
              <div className="flex-1 space-y-1">
                <Input name="description" placeholder="Ligar para marcar visita..." required />
              </div>
              <div className="w-36 space-y-1">
                <Input type="datetime-local" name="date" required />
              </div>
              <Button type="submit" disabled={isPending} className="w-12">
                {isPending ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "+"}
              </Button>
            </form>
          </div>

          {/* Follow-ups / Histórico */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Follow-up</h3>
            
            <form action={async (formData) => {
              setIsPending(true);
              await addInteractionAction(formData);
              setIsPending(false);
              (document.getElementById("followup-input") as HTMLInputElement).value = "";
            }} className="flex gap-2">
              <input type="hidden" name="clientId" value={client.id} />
              <div className="flex-1">
                <Input id="followup-input" name="description" placeholder="O que foi conversado agora?" required />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Salvar"}
              </Button>
            </form>

            <div className="space-y-3 mt-4">
              {client.interactions && client.interactions.length > 0 ? (
                client.interactions.map((interaction: any) => (
                  <div key={interaction.id} className="text-sm p-3 border rounded-lg bg-slate-50 relative">
                    <div className="text-xs text-slate-400 mb-1 font-medium">
                      {format(new Date(interaction.date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{interaction.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">Nenhum follow-up registrado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
