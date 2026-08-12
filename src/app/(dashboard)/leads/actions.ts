"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { LeadStage } from "@prisma/client";

export async function createLeadAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const clientId = formData.get("clientId") as string;
  const propertyId = formData.get("propertyId") as string;
  const origin = formData.get("origin") as string;

  await prisma.lead.create({
    data: {
      userId: user.id,
      clientId: clientId || null,
      propertyId: propertyId || null,
      origin: origin || "Indicação",
      stage: "NEW",
    },
  });

  revalidatePath("/leads");
  redirect("/leads");
}

export async function updateLeadStageAction(leadId: string, stage: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      stage: stage as LeadStage,
    },
  });

  revalidatePath("/leads");
}
