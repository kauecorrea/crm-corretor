"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLeadAction } from "../actions";

export function NovoLeadForm({ clientes, imoveis }: { clientes: any[], imoveis: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [clientId, setClientId] = useState<string>("");
  const [propertyId, setPropertyId] = useState<string>("");

  const selectedClient = clientes.find(c => c.id === clientId);
  const selectedProperty = imoveis.find(p => p.id === propertyId);

  return (
    <form action={async (formData) => {
      setIsPending(true);
      try {
        await createLeadAction(formData);
      } catch (e) {
        setIsPending(false);
      }
    }} className="space-y-4">
      
      <div className="space-y-2">
        <Label htmlFor="clientId">Cliente (Opcional)</Label>
        <Select name="clientId" value={clientId} onValueChange={setClientId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente">
              {selectedClient ? selectedClient.name : "Selecione um cliente"}
            </SelectValue>
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
        <Select name="propertyId" value={propertyId} onValueChange={setPropertyId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um imóvel">
              {selectedProperty ? selectedProperty.title : "Selecione um imóvel"}
            </SelectValue>
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando Lead...
            </>
          ) : "Criar Lead"}
        </Button>
      </div>
    </form>
  );
}
