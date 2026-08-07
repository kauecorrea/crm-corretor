import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Home as HomeIcon, MapPin, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default async function ImoveisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const imoveis = await prisma.property.findMany({
    where: {
      userId: user.id,
    },
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Imóveis</h1>
          <p className="text-sm text-muted-foreground">
            Sua carteira de captações
          </p>
        </div>
        <Link href="/imoveis/novo">
          <Button size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </header>
      
      <div className="space-y-4">
        {imoveis.length === 0 ? (
          <div className="text-center p-8 bg-background border rounded-lg">
            <HomeIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum imóvel ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">Cadastre seu primeiro imóvel para começar.</p>
            <Link href="/imoveis/novo">
              <Button variant="outline">Cadastrar Imóvel</Button>
            </Link>
          </div>
        ) : (
          imoveis.map((imovel) => (
            <Link key={imovel.id} href={`/imoveis/${imovel.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer mb-4 overflow-hidden">
                {imovel.photos.length > 0 && (
                  <div className="relative h-48 w-full bg-muted">
                    <Image 
                      src={imovel.photos[0]} 
                      alt={imovel.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {imovel.photos.length} foto(s)
                    </div>
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-lg leading-tight">{imovel.title}</div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${imovel.type === 'SALE' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {imovel.type === 'SALE' ? 'VENDA' : 'LOCAÇÃO'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-primary font-bold text-lg mb-2">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.price)}
                  </div>

                  {imovel.owner && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 pt-3 border-t">
                      <User className="h-4 w-4" />
                      Proprietário: {imovel.owner.name}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
