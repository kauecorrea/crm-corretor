import Link from "next/link";
import { Home, Users, Building, FileText, Settings } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/40 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Início</span>
        </Link>
        <Link href="/clientes" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">Clientes</span>
        </Link>
        <Link href="/imoveis" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground">
          <Building className="w-5 h-5" />
          <span className="text-[10px] font-medium">Imóveis</span>
        </Link>
        <Link href="/leads" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground">
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-medium">Funil</span>
        </Link>
        <Link href="/config" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Ajustes</span>
        </Link>
      </div>
    </nav>
  );
}
