import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createContractAction } from "../actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export default async function NovoContratoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const clientes = await prisma.client.findMany({
    where: { userId: user?.id },
    orderBy: { name: 'asc' }
  });

  const imoveis = await prisma.property.findMany({
    where: { 
      userId: user?.id,
      status: 'AVAILABLE'
    },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/contratos">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nova Venda/Locação</h1>
        </div>
      </header>
      
      <form action={createContractAction} className="space-y-4 pb-10">
        
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Negócio</Label>
          <Select name="type" required defaultValue="SALE">
            <SelectTrigger>
              <SelectValue placeholder="Venda ou Locação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SALE">Venda</SelectItem>
              <SelectItem value="RENTAL">Locação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyId">Imóvel Negociado</Label>
          <Select name="propertyId" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um imóvel disponível" />
            </SelectTrigger>
            <SelectContent>
              {imoveis.map(imovel => (
                <SelectItem key={imovel.id} value={imovel.id}>{imovel.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente (Comprador/Locatário)</Label>
          <Select name="clientId" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map(cliente => (
                <SelectItem key={cliente.id} value={cliente.id}>{cliente.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dealValue">Valor Fechado (R$)</Label>
          <Input id="dealValue" name="dealValue" type="text" required placeholder="Ex: 480000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commission">Sua Comissão (R$)</Label>
          <Input id="commission" name="commission" type="text" placeholder="Ex: 24000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data do Fechamento</Label>
          <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Registrar Negócio
          </Button>
        </div>
      </form>
    </div>
  );
}
