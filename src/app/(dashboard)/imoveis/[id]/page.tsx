import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, MapPin, User, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { DeleteImovelButton } from "./delete-imovel-button";

export default async function ImovelDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const imovel = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: true,
    }
  });

  if (!imovel) {
    notFound();
  }

  const isOwner = user?.id === imovel.userId;

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/imoveis">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex-1 flex justify-between items-start">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight truncate">{imovel.title}</h1>
              {isOwner && <DeleteImovelButton id={imovel.id} />}
            </div>
            <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
              <div className="flex flex-col">
                <span className="font-medium text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.price)} {imovel.type === 'SALE_AND_RENTAL' && <span className="text-xs text-muted-foreground font-normal">(Venda)</span>}
                </span>
                {imovel.type === 'SALE_AND_RENTAL' && imovel.rentPrice && (
                  <span className="font-medium text-primary mt-0.5">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.rentPrice)} <span className="text-xs text-muted-foreground font-normal">(Locação)</span>
                  </span>
                )}
              </div>
              <span>•</span>
              <span>{imovel.type === 'SALE' ? 'Venda' : imovel.type === 'RENTAL' ? 'Locação' : 'Venda e Locação'}</span>
            </div>
          </div>
        </div>
      </header>

      {imovel.photos.length > 0 && (
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
          {imovel.photos.map((photo, idx) => (
            <div key={idx} className="snap-center shrink-0 w-[85vw] max-w-sm aspect-video relative rounded-xl overflow-hidden bg-muted border">
              <Image 
                src={photo} 
                alt={`Foto ${idx + 1}`} 
                fill 
                className="object-cover" 
              />
            </div>
          ))}
        </div>
      )}

      {imovel.owner && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Proprietário</p>
              <div className="font-medium">{imovel.owner.name}</div>
            </div>
            <Link href={`/clientes/${imovel.owner.id}`}>
              <Button variant="outline" size="sm">Ver Perfil</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {imovel.description && (
        <div className="space-y-2">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" /> 
            Descrição
          </h3>
          <div className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed p-4 bg-muted/30 rounded-lg">
            {imovel.description}
          </div>
        </div>
      )}
    </div>
  );
}
