"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function createImovelAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priceStr = formData.get("price") as string;
  const typeStr = formData.get("type") as string; // 'SALE' or 'RENT'
  const ownerId = formData.get("ownerId") as string;
  const photos = formData.getAll("photos") as File[];

  const price = parseFloat(priceStr.replace(/\D/g, "")) / 100 || 0;
  const type = (typeStr as any) || "SALE";

  // Create property in DB
  const imovel = await prisma.property.create({
    data: {
      userId: user.id,
      ownerId,
      title,
      description,
      price,
      type,
      photos: [], // We will update this after uploading
    },
  });

  // Upload photos to Supabase Storage
  const uploadedUrls: string[] = [];
  
  if (photos && photos.length > 0 && photos[0].size > 0) {
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user.id}/${imovel.id}/${i}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('crm_uploads')
        .upload(fileName, photo, {
          cacheControl: '3600',
          upsert: false
        });

      if (data) {
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('crm_uploads').getPublicUrl(fileName);
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    // Update property with photo URLs
    if (uploadedUrls.length > 0) {
      await prisma.property.update({
        where: { id: imovel.id },
        data: { photos: uploadedUrls },
      });
    }
  }

  revalidatePath("/imoveis");
  redirect("/imoveis");
}
