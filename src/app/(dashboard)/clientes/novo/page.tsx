import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClientAction } from "../actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NovoClientePage() {
  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Cliente</h1>
        </div>
      </header>
      
      <form action={createClientAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" name="name" required placeholder="Ex: João da Silva" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone / WhatsApp</Label>
          <Input id="phone" name="phone" type="tel" placeholder="(11) 99999-9999" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="joao@email.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Perfil do Cliente</Label>
          <Select name="type" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BUYER">Comprador</SelectItem>
              <SelectItem value="RENTER">Locatário</SelectItem>
              <SelectItem value="OWNER">Proprietário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" name="notes" placeholder="Anotações sobre o que o cliente procura, etc." className="min-h-[100px]" />
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Salvar Cliente
          </Button>
        </div>
      </form>
    </div>
  );
}
