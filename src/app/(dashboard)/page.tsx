import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Users, Home, Target, TrendingUp, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
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
      take: 4,
      include: { client: true }
    })
  ]);

  const totalComissoes = contracts.reduce((acc, curr) => acc + (curr.commission || 0), 0);
  const totalVendas = contracts.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visão geral do seu negócio imobiliário
          </p>
        </div>
        <form className="md:hidden" action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}>
          <Button variant="ghost" size="icon" type="submit" title="Sair">
            <LogOut className="h-5 w-5 text-slate-500" />
          </Button>
        </form>
      </header>
      
      {/* KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-transparent shadow-md hover:-translate-y-1 transition-transform duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4 opacity-90">
              <span className="text-xs font-semibold uppercase tracking-wider">Comissões</span>
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalComissoes)}
            </div>
            <p className="text-xs opacity-75 mt-1 font-medium">Acumulado</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-1 transition-transform duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4 text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Leads Ativos</span>
              <div className="p-2 bg-orange-100 rounded-md">
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{activeLeads}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">No funil</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-1 transition-transform duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4 text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Imóveis Disp.</span>
              <div className="p-2 bg-blue-100 rounded-md">
                <Home className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{activeProperties}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Para venda/locação</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-1 transition-transform duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4 text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Clientes</span>
              <div className="p-2 bg-emerald-100 rounded-md">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{totalClients}</div>
            <p className="text-xs text-slate-400 mt-1 font-medium">Na base de dados</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Leads Estagnados */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-full mt-0.5">
          <Target className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900">Atenção aos seus Leads</h3>
          <p className="text-sm text-amber-700 mt-1">Você tem alguns leads parados há mais de 5 dias no seu funil de vendas sem interação. Não perca o timing da venda!</p>
          <Link href="/leads">
            <Button variant="link" className="text-amber-700 p-0 h-auto font-bold mt-2 hover:text-amber-800">
              Ver Funil de Vendas <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lembretes Recentes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center text-slate-800">
              <Calendar className="h-5 w-5 mr-2 text-primary" /> 
              Próximos Lembretes
            </h3>
            <Link href="/leads" className="text-sm font-medium text-primary hover:underline flex items-center">
              Ver todos <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid gap-3">
            {reminders.length === 0 ? (
              <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
                <Calendar className="h-10 w-10 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-600">Sem lembretes</p>
                <p className="text-xs text-slate-400 mt-1">Você está com tudo em dia!</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className="glass-card p-4 border-l-4 border-l-orange-500 hover:bg-white/90 transition-colors flex justify-between items-center group">
                  <div>
                    <div className="font-semibold text-sm text-slate-800 mb-1 group-hover:text-primary transition-colors">{reminder.description}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-medium">{reminder.client.name}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-md mb-1">
                      {new Date(reminder.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(reminder.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-slate-800">Acesso Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/leads">
              <div className="p-4 glass-card hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 text-center shadow-sm cursor-pointer group">
                <div className="h-10 w-10 mx-auto bg-slate-50 group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors mb-3">
                  <Target className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">Funil</div>
              </div>
            </Link>
            <Link href="/imoveis">
              <div className="p-4 glass-card hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 text-center shadow-sm cursor-pointer group">
                <div className="h-10 w-10 mx-auto bg-slate-50 group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors mb-3">
                  <Home className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">Imóveis</div>
              </div>
            </Link>
            <Link href="/clientes">
              <div className="p-4 glass-card hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 text-center shadow-sm cursor-pointer group">
                <div className="h-10 w-10 mx-auto bg-slate-50 group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors mb-3">
                  <Users className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">Clientes</div>
              </div>
            </Link>
            <Link href="/contratos">
              <div className="p-4 glass-card hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 text-center shadow-sm cursor-pointer group">
                <div className="h-10 w-10 mx-auto bg-slate-50 group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors mb-3">
                  <CheckCircle2 className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">Contratos</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
