"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createImovelAction } from "../actions";
import { Client } from "@prisma/client";

export function NovoImovelForm({ clientes }: { clientes: Client[] }) {
  const [propertyType, setPropertyType] = useState("SALE");
  const [isPending, setIsPending] = useState(false);

  return (
    <form action={async (formData) => {
      setIsPending(true);
      await createImovelAction(formData);
      setIsPending(false);
    }} className="space-y-4 pb-10">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Imóvel</Label>
        <Input id="title" name="title" required placeholder="Ex: Apartamento 2 quartos no Centro" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Negócio</Label>
        <Select name="type" required value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Venda ou Locação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SALE">Venda</SelectItem>
            <SelectItem value="RENTAL">Locação</SelectItem>
            <SelectItem value="SALE_AND_RENTAL">Venda e Locação</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(propertyType === "SALE" || propertyType === "SALE_AND_RENTAL") && (
          <div className="space-y-2">
            <Label htmlFor="price">Valor de Venda (R$)</Label>
            <Input id="price" name="price" type="text" required placeholder="Ex: 500000" />
          </div>
        )}

        {(propertyType === "RENTAL" || propertyType === "SALE_AND_RENTAL") && (
          <div className="space-y-2">
            <Label htmlFor="rentPrice">Valor de Locação (R$)</Label>
            <Input id="rentPrice" name="rentPrice" type="text" required placeholder="Ex: 2500" />
          </div>
        )}
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar Imóvel"}
        </Button>
      </div>
    </form>
  );
}
