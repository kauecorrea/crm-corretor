import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLeadAction } from "../actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export default async function NovoLeadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const clientes = await prisma.client.findMany({
    where: { userId: user?.id },
    orderBy: { name: 'asc' }
  });

  const imoveis = await prisma.property.findMany({
    where: { userId: user?.id },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Lead</h1>
        </div>
      </header>
      
      <form action={createLeadAction} className="space-y-4">
        
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente (Opcional)</Label>
          <Select name="clientId">
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map(cliente => (
                <SelectItem key={cliente.id} value={cliente.id}>{cliente.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Vincule a um cliente já existente, ou deixe em branco se for um contato inicial.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyId">Imóvel de Interesse (Opcional)</Label>
          <Select name="propertyId">
            <SelectTrigger>
              <SelectValue placeholder="Selecione um imóvel" />
            </SelectTrigger>
            <SelectContent>
              {imoveis.map(imovel => (
                <SelectItem key={imovel.id} value={imovel.id}>{imovel.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origin">Origem do Lead</Label>
          <Input id="origin" name="origin" placeholder="Ex: WhatsApp, Instagram, Placa, Indicação..." />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Criar Lead
          </Button>
        </div>
      </form>
    </div>
  );
}
