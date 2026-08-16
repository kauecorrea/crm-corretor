import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NovoLeadForm } from "./novo-lead-form";

export default async function NovoLeadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const clientes = await prisma.client.findMany({
    where: { userId: user?.id },
    orderBy: { name: 'asc' }
  });

  const imoveis = await prisma.property.findMany({
    where: { userId: user?.id },
    orderBy: { title: 'asc' }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Lead</h1>
        </div>
      </header>
      
      <NovoLeadForm clientes={clientes} imoveis={imoveis} />
    </div>
  );
}
