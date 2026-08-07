"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/login?error=Credenciais inválidas");
  }

  // Ensure user exists in Prisma
  await prisma.user.upsert({
    where: { id: data.user.id },
    update: {},
    create: {
      id: data.user.id,
      email: data.user.email!,
    },
  });

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/login?error=Não foi possível criar a conta");
  }

  // Ensure user exists in Prisma
  await prisma.user.upsert({
    where: { id: data.user.id },
    update: {},
    create: {
      id: data.user.id,
      email: data.user.email!,
    },
  });

  revalidatePath("/", "layout");
  redirect("/");
}
