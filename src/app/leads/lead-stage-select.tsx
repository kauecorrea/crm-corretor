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

export function LeadStageSelect({ leadId, initialStage }: { leadId: string, initialStage: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select 
      className="text-xs bg-background border rounded px-2 py-1 w-full mt-2"
      disabled={isPending}
      defaultValue={initialStage}
      onChange={(e) => {
        startTransition(async () => {
          await updateLeadStageAction(leadId, e.target.value);
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
