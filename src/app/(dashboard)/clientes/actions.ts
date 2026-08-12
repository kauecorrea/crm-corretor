"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { ClientType } from "@prisma/client";

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const typeStr = formData.get("type") as string; // Will just take one for simplicity in this MVP
  const notes = formData.get("notes") as string;

  const type = typeStr as ClientType;

  await prisma.client.create({
    data: {
      userId: user.id,
      name,
      phone,
      email,
      types: type ? [type] : [],
      notes,
    },
  });

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function addInteractionAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const clientId = formData.get("clientId") as string;
  const description = formData.get("description") as string;
  const typeStr = formData.get("type") as string;
  const type = (typeStr as any) || "NOTE";

  await prisma.interaction.create({
    data: {
      clientId,
      description,
      type,
    }
  });

  revalidatePath(`/clientes/${clientId}`);
}

export async function addReminderAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const clientId = formData.get("clientId") as string;
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);

  await prisma.reminder.create({
    data: {
      description,
      date,
      clientId,
      userId: user.id
    }
  });

  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/");
}

export async function addDocumentAction(clientId: string, name: string, fileUrl: string, type: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.clientDocument.create({
    data: {
      name,
      fileUrl,
      type,
      clientId,
    }
  });

  revalidatePath(`/clientes/${clientId}`);
}
