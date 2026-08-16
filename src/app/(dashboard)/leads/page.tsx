import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "./kanban-board";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const leads = await prisma.lead.findMany({
    where: {
      userId: user.id,
    },
    include: {
      client: {
        include: {
          interactions: { orderBy: { date: 'desc' } },
          reminders: { orderBy: { date: 'asc' }, where: { status: 'PENDING' } }
        }
      },
      property: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Funil de Vendas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe e mova seus leads pelo processo
          </p>
        </div>
        <Link href="/leads/novo">
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </Link>
      </header>
      
      {/* Kanban Board Component with drag-and-drop */}
      <KanbanBoard initialLeads={leads} />
    </div>
  );
}
