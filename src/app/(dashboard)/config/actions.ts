"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSlugAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const slug = formData.get("slug") as string;
  
  // Format slug: lowercase, replace spaces with hyphens, remove special characters
  const formattedSlug = slug
    .toLowerCase()
    .replace(/\\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (!formattedSlug) {
    throw new Error("Slug inválido");
  }

  // Check if slug is already taken by someone else
  const existingUser = await prisma.user.findUnique({
    where: { slug: formattedSlug }
  });

  if (existingUser && existingUser.id !== user.id) {
    throw new Error("Este link já está em uso por outro corretor. Escolha outro.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { slug: formattedSlug }
  });

  revalidatePath("/config");
  return formattedSlug;
}
