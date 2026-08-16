"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteClientAction } from "../actions";

export function DeleteClientButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja apagar este cliente? Esta ação não pode ser desfeita e apagará todo o histórico e lembretes deste cliente.")) {
      setIsPending(true);
      try {
        await deleteClientAction(id);
      } catch (error) {
        setIsPending(false);
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDelete}
      disabled={isPending}
      className="h-7 gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
    >
      {isPending ? (
        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      Apagar
    </Button>
  );
}
