import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileCheck, Calendar, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ContratosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const contratos = await prisma.contract.findMany({
    where: {
      userId: user.id,
    },
    include: {
      client: true,
      property: true,
    },
    orderBy: {
      date: 'desc',
    }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vendas e Locações</h1>
          <p className="text-sm text-muted-foreground">
            Seus negócios fechados
          </p>
        </div>
        <Link href="/contratos/novo">
          <Button size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      <div className="space-y-4">
        {contratos.length === 0 ? (
          <div className="text-center p-8 bg-background border rounded-lg">
            <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum negócio fechado ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">Registre sua primeira venda ou locação.</p>
            <Link href="/contratos/novo">
              <Button variant="outline">Registrar Venda/Locação</Button>
            </Link>
          </div>
        ) : (
          contratos.map((contrato) => (
            <Card key={contrato.id} className="mb-4 overflow-hidden border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-medium text-lg leading-tight">
                    {contrato.type === 'SALE' ? 'Venda' : 'Locação'}
                  </div>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(contrato.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Home className="h-4 w-4" />
                    <span className="truncate">{contrato.property?.title || 'Imóvel não encontrado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="truncate">Cliente: {contrato.client?.name || 'Não informado'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Valor do Negócio</p>
                    <p className="font-bold text-base">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.dealValue)}
                    </p>
                  </div>
                  {contrato.commission ? (
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Comissão</p>
                      <p className="font-bold text-base text-green-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.commission)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
