"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function createContractAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const clientId = formData.get("clientId") as string;
  const propertyId = formData.get("propertyId") as string;
  const typeStr = formData.get("type") as string;
  const dealValueStr = formData.get("dealValue") as string;
  const commissionStr = formData.get("commission") as string;
  const dateStr = formData.get("date") as string;

  const dealValue = parseFloat(dealValueStr.replace(/\D/g, "")) / 100 || 0;
  const commission = parseFloat(commissionStr.replace(/\D/g, "")) / 100 || 0;

  await prisma.contract.create({
    data: {
      userId: user.id,
      clientId,
      propertyId,
      type: (typeStr as any) || "SALE",
      dealValue,
      commission,
      date: new Date(dateStr),
    },
  });

  // Also update property status if it's SALE or RENTAL
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      status: typeStr === "SALE" ? "SOLD" : "RENTED"
    }
  });

  revalidatePath("/contratos");
  redirect("/contratos");
}
