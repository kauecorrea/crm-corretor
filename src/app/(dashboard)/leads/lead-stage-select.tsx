"use client";

import { useTransition } from "react";
import { updateLeadStageAction } from "./actions";

const STAGES = [
  { value: "NEW", label: "Novo Lead" },
  { value: "CONTACTED", label: "Contatado" },
  { value: "VISIT_SCHEDULED", label: "Visita Agendada" },
  { value: "VISIT_DONE", label: "Visita Realizada" },
  { value: "PROPOSAL", label: "Proposta" },
  { value: "NEGOTIATION", label: "Negociação" },
  { value: "WON", label: "Ganho" },
  { value: "LOST", label: "Perdido" },
];

export function LeadStageSelect({ leadId, initialStage, onStageChange }: { leadId: string, initialStage: string, onStageChange?: (newStage: string) => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select 
      className="text-xs bg-background border rounded px-2 py-1 w-full mt-2"
      disabled={isPending}
      defaultValue={initialStage}
      onChange={(e) => {
        const newStage = e.target.value;
        if (onStageChange) onStageChange(newStage);
        startTransition(async () => {
          await updateLeadStageAction(leadId, newStage);
        });
      }}
    >
      {STAGES.map(stage => (
        <option key={stage.value} value={stage.value}>
          Mover para: {stage.label}
        </option>
      ))}
    </select>
  );
}
