import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addInteractionAction, addReminderAction } from "../actions";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ClienteDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const cliente = await prisma.client.findUnique({
    where: { id },
    include: {
      interactions: { orderBy: { date: 'desc' } },
      reminders: { orderBy: { date: 'asc' } },
    }
  });

  if (!cliente) {
    notFound();
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{cliente.name}</h1>
            {cliente.phone && (
              <a 
                href={`https://wa.me/55${cliente.phone.replace(/\\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(cliente.name.split(' ')[0])}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="h-7 gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                  <MessageSquare className="h-3.5 w-3.5" />
                  WhatsApp
                </Button>
              </a>
            )}
          </div>
          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
            {cliente.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {cliente.phone}</span>}
            {cliente.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {cliente.email}</span>}
          </div>
        </div>
      </header>

      {cliente.notes && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Observações</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {cliente.notes}
          </CardContent>
        </Card>
      )}

      {/* Interações */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Histórico</h3>
        
        <form action={addInteractionAction} className="flex gap-2">
          <input type="hidden" name="clientId" value={cliente.id} />
          <div className="flex-1">
            <Input name="description" placeholder="Adicionar anotação rápida..." required />
          </div>
          <Button type="submit">Add</Button>
        </form>

        <div className="space-y-3 mt-4">
          {cliente.interactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">Nenhuma interação registrada.</p>
          ) : (
            cliente.interactions.map(interaction => (
              <div key={interaction.id} className="p-3 bg-muted/50 rounded-lg text-sm">
                <div className="font-medium mb-1">{interaction.description}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(interaction.date).toLocaleDateString('pt-BR')} às {new Date(interaction.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lembretes */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-bold text-lg flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> Lembretes</h3>
        
        <form action={addReminderAction} className="space-y-3">
          <input type="hidden" name="clientId" value={cliente.id} />
          <div className="flex gap-2">
            <Input name="description" placeholder="Ex: Ligar para confirmar visita" required className="flex-1" />
          </div>
          <div className="flex gap-2">
            <Input name="date" type="datetime-local" required className="flex-1" />
            <Button type="submit">Agendar</Button>
          </div>
        </form>

        <div className="space-y-3 mt-4">
          {cliente.reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">Nenhum lembrete agendado.</p>
          ) : (
            cliente.reminders.map(reminder => (
              <div key={reminder.id} className={`p-3 rounded-lg text-sm border-l-4 ${reminder.status === 'DONE' ? 'border-green-500 bg-green-500/10' : 'border-primary bg-primary/5'}`}>
                <div className="font-medium mb-1">{reminder.description}</div>
                <div className="text-xs text-muted-foreground">
                  Data: {new Date(reminder.date).toLocaleDateString('pt-BR')} às {new Date(reminder.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
