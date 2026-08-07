import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Users, Home, Target, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomeDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Busca dados em paralelo
  const [
    totalClients,
    activeProperties,
    activeLeads,
    contracts,
    reminders
  ] = await Promise.all([
    prisma.client.count({ where: { userId: user.id } }),
    prisma.property.count({ where: { userId: user.id, status: 'AVAILABLE' } }),
    prisma.lead.count({ where: { userId: user.id, stage: { notIn: ['WON', 'LOST'] } } }),
    prisma.contract.findMany({ where: { userId: user.id } }),
    prisma.reminder.findMany({ 
      where: { userId: user.id, status: 'PENDING' },
      orderBy: { date: 'asc' },
      take: 3,
      include: { client: true }
    })
  ]);

  const totalComissoes = contracts.reduce((acc, curr) => acc + (curr.commission || 0), 0);
  const totalVendas = contracts.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
            {user.email}
          </p>
        </div>
        <form action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}>
          <Button variant="ghost" size="icon" type="submit" title="Sair">
            <LogOut className="h-5 w-5" />
          </Button>
        </form>
      </header>
      
      {/* KPIs Principais */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2 opacity-80">
              <span className="text-xs font-semibold uppercase tracking-wider">Comissões</span>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalComissoes)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2 text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Leads Ativos</span>
              <Target className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold">{activeLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2 text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Imóveis Disp.</span>
              <Home className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold">{activeProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2 text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Clientes</span>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>
      </div>

      {/* Atalhos Rápidos */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Módulos do CRM</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/leads">
            <div className="p-3 bg-background border rounded-lg hover:border-primary transition-colors text-center shadow-sm">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Funil</div>
            </div>
          </Link>
          <Link href="/imoveis">
            <div className="p-3 bg-background border rounded-lg hover:border-primary transition-colors text-center shadow-sm">
              <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Imóveis</div>
            </div>
          </Link>
          <Link href="/clientes">
            <div className="p-3 bg-background border rounded-lg hover:border-primary transition-colors text-center shadow-sm">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Clientes</div>
            </div>
          </Link>
          <Link href="/contratos">
            <div className="p-3 bg-background border rounded-lg hover:border-primary transition-colors text-center shadow-sm">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Contratos</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Lembretes Recentes */}
      <div>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Lembretes Pendentes
        </h3>
        <div className="space-y-3">
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">Você não tem lembretes pendentes.</p>
          ) : (
            reminders.map((reminder) => (
              <div key={reminder.id} className="p-3 border-l-4 border-l-yellow-500 bg-background border border-muted rounded-lg shadow-sm">
                <div className="font-medium text-sm mb-1">{reminder.description}</div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>{reminder.client.name}</span>
                  <span>{new Date(reminder.date).toLocaleDateString('pt-BR')} {new Date(reminder.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
