import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao CRM Imobiliário
          </p>
        </div>
        <form action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}>
          <Button variant="ghost" size="icon" type="submit" title="Sair">
            <LogOut className="h-5 w-5" />
          </Button>
        </form>
      </header>
      
      <div className="grid grid-cols-2 gap-4">
        <Link href="/clientes">
          <div className="p-4 bg-background border rounded-lg shadow-sm hover:border-primary transition-colors cursor-pointer h-full">
            <p className="text-sm font-medium text-muted-foreground mb-2">Carteira de Clientes</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Ver</span>
            </div>
          </div>
        </Link>
        <Link href="/imoveis">
          <div className="p-4 bg-background border rounded-lg shadow-sm hover:border-primary transition-colors cursor-pointer h-full">
            <p className="text-sm font-medium text-muted-foreground mb-2">Imóveis</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Ver</span>
            </div>
          </div>
        </Link>
        <Link href="/leads" className="col-span-2">
          <div className="p-4 bg-background border rounded-lg shadow-sm hover:border-primary transition-colors cursor-pointer h-full">
            <p className="text-sm font-medium text-muted-foreground mb-2">Funil de Vendas (Kanban)</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">Acompanhar Leads</span>
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Novo módulo</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
