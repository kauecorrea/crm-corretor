import Link from "next/link";
import { Home, Users, Building, FileText, Settings, LogOut, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex-1 flex flex-col min-h-0 border-r border-border bg-white dark:bg-slate-900 glass-card">
        <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-border/50">
          <span className="text-xl font-bold text-primary tracking-tight">CRM Corretor</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link
              href="/"
              className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors"
            >
              <Home className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-primary" />
              Início
            </Link>
            <Link
              href="/clientes"
              className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors"
            >
              <Users className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-primary" />
              Clientes
            </Link>
            <Link
              href="/imoveis"
              className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors"
            >
              <Building className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-primary" />
              Imóveis
            </Link>
            <Link
              href="/leads"
              className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors"
            >
              <FileText className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-primary" />
              Funil
            </Link>
            <Link
              href="/config"
              className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors"
            >
              <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-primary" />
              Ajustes
            </Link>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-border/50 p-4">
          <div className="flex items-center w-full">
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700 truncate w-40">{user.email}</p>
              <form action={async () => {
                "use server";
                const supabase = await createClient();
                await supabase.auth.signOut();
              }}>
                <button type="submit" className="text-xs font-medium text-slate-500 hover:text-primary flex items-center mt-1 transition-colors cursor-pointer">
                  <LogOut className="w-3 h-3 mr-1" />
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
