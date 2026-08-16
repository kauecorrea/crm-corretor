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

  const [ownerId, setOwnerId] = useState<string>("");
  const selectedOwner = clientes.find(c => c.id === ownerId);

  return (
    <form action={async (formData) => {
      setIsPending(true);
      try {
        await createImovelAction(formData);
      } catch (e: any) {
        if (e?.message === "NEXT_REDIRECT" || e?.digest?.startsWith("NEXT_REDIRECT")) {
          throw e;
        }
        setIsPending(false);
      }
    }} className="space-y-4 pb-10">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Imóvel</Label>
        <Input id="title" name="title" required placeholder="Ex: Apartamento 2 quartos no Centro" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Negócio</Label>
        <Select name="type" required value={propertyType} onValueChange={(val) => val && setPropertyType(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Venda ou Locação">
              {propertyType === "SALE" ? "Venda" : propertyType === "RENTAL" ? "Locação" : "Venda e Locação"}
            </SelectValue>
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
        <Select name="ownerId" required value={ownerId} onValueChange={(val) => val && setOwnerId(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o proprietário">
              {selectedOwner ? selectedOwner.name : "Selecione o proprietário"}
            </SelectValue>
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
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando Imóvel...
            </>
          ) : "Salvar Imóvel"}
        </Button>
      </div>
    </form>
  );
}
