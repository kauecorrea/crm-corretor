import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        {/* Placeholder cards */}
        <div className="p-4 bg-background border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Leads Novos</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-4 bg-background border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Visitas</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
