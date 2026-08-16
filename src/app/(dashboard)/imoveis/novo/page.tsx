import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NovoImovelForm } from "./novo-imovel-form";

export default async function NovoImovelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const clientes = await prisma.client.findMany({
    where: { userId: user?.id },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/imoveis">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novo Imóvel</h1>
        </div>
      </header>
      
      <NovoImovelForm clientes={clientes} />
    </div>
  );
}
