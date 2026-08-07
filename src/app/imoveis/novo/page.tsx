import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createImovelAction } from "../actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export default async function NovoImovelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const clientes = await prisma.client.findMany({
    where: { userId: user?.id },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/imoveis">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Imóvel</h1>
        </div>
      </header>
      
      <form action={createImovelAction} className="space-y-4 pb-10">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Imóvel</Label>
          <Input id="title" name="title" required placeholder="Ex: Apartamento 2 quartos no Centro" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Negócio</Label>
          <Select name="type" required defaultValue="SALE">
            <SelectTrigger>
              <SelectValue placeholder="Venda ou Locação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SALE">Venda</SelectItem>
              <SelectItem value="RENT">Locação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Valor (R$)</Label>
          <Input id="price" name="price" type="text" required placeholder="Ex: 500000" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerId">Proprietário (Cliente)</Label>
          <Select name="ownerId" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o proprietário" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map(cliente => (
                <SelectItem key={cliente.id} value={cliente.id}>{cliente.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photos">Fotos</Label>
          <Input id="photos" name="photos" type="file" multiple accept="image/*" className="cursor-pointer" />
          <p className="text-xs text-muted-foreground">Você pode selecionar várias fotos de uma vez.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" placeholder="Detalhes do imóvel..." className="min-h-[120px]" />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Salvar Imóvel
          </Button>
        </div>
      </form>
    </div>
  );
}
