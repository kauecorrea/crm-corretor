import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const clientes = await prisma.client.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Sua carteira de clientes
          </p>
        </div>
        <Link href="/clientes/novo">
          <Button size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      <div className="space-y-4">
        {clientes.length === 0 ? (
          <div className="text-center p-8 bg-background border rounded-lg">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum cliente ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">Adicione seu primeiro cliente para começar.</p>
            <Link href="/clientes/novo">
              <Button variant="outline">Adicionar Cliente</Button>
            </Link>
          </div>
        ) : (
          clientes.map((cliente) => (
            <Link key={cliente.id} href={`/clientes/${cliente.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer mb-4">
                <CardContent className="p-4">
                  <div className="font-medium text-lg mb-1">{cliente.name}</div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {cliente.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {cliente.phone}
                      </div>
                    )}
                    {cliente.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {cliente.email}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    {cliente.types.map((type) => (
                      <span key={type} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        {type === 'BUYER' ? 'COMPRADOR' : type === 'RENTER' ? 'LOCATÁRIO' : 'PROPRIETÁRIO'}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
