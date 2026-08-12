import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, MapPin, User, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default async function ImovelDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const imovel = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: true,
    }
  });

  if (!imovel) {
    notFound();
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/imoveis">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex-1 overflow-hidden">
          <h1 className="text-xl font-bold tracking-tight truncate">{imovel.title}</h1>
          <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-primary">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.price)}
            </span>
            <span>•</span>
            <span>{imovel.type === 'SALE' ? 'Venda' : 'Locação'}</span>
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
