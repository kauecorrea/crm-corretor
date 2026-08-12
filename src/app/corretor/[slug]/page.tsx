import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Building2, Smartphone } from "lucide-react";

export default async function CorretorPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  
  const broker = await prisma.user.findUnique({
    where: { slug },
    include: {
      properties: {
        where: { status: 'AVAILABLE' },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!broker) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Imóveis Disponíveis
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Corretor de Imóveis
            </p>
          </div>
          <a 
            href={`https://wa.me/5591985800448?text=Ol%C3%A1,%20estou%20entrando%20em%20contato%20pelo%20seu%20portf%C3%B3lio%20online!`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-emerald-600 text-primary-foreground hover:bg-emerald-600/90 h-10 py-2 px-4 shadow-sm"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Falar com Corretor
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          Imóveis Disponíveis ({broker.properties.length})
        </h2>

        {broker.properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Nenhum imóvel disponível no momento.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {broker.properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200/60 bg-white">
                {/* Fallback image if no photos */}
                <div className="h-48 bg-slate-100 relative group flex items-center justify-center">
                  {property.photos && property.photos.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={property.photos[0]} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Home className="w-12 h-12 text-slate-300" />
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm hover:bg-white text-xs font-semibold shadow-sm">
                      {property.type === 'SALE' ? 'Venda' : 'Locação'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <div className="text-2xl font-bold text-slate-900 mb-2">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)}
                  </div>
                  <h3 className="font-semibold text-lg text-slate-800 line-clamp-1 mb-2">{property.title}</h3>
                  
                  {property.address && (
                    <p className="text-sm text-slate-500 flex items-start gap-1.5 line-clamp-2 mb-4">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{property.address} {property.neighborhood && `- ${property.neighborhood}`}</span>
                    </p>
                  )}

                  <a 
                    href={`https://wa.me/5591985800448?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20im%C3%B3vel:%20*${encodeURIComponent(property.title)}*`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-slate-50 hover:text-slate-900 h-9 px-3"
                  >
                    Tenho Interesse
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
