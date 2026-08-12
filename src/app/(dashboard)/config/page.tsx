import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { LogOut, User, Shield, Bell, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { updateSlugAction } from "./actions";

export default async function ConfigPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  return (
    <div className="p-4 space-y-6 pb-20 max-w-3xl mx-auto animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ajustes</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gerencie sua conta e configurações
        </p>
      </header>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Portfólio Público
          </CardTitle>
          <CardDescription>Configure o seu link exclusivo para enviar aos clientes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={updateSlugAction} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="slug">Seu Link (URL)</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-2 rounded-md border border-slate-200">
                  seusite.com/corretor/
                </span>
                <Input 
                  id="slug" 
                  name="slug" 
                  defaultValue={dbUser?.slug || ""} 
                  placeholder="seu-nome" 
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Use apenas letras minúsculas, números e hifens (-).</p>
            </div>
            <SubmitButton pendingText="Salvando..." size="sm">
              Salvar Link
            </SubmitButton>
          </form>

          {dbUser?.slug && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
              <p className="text-sm text-emerald-800 font-medium">Seu portfólio está ativo em:</p>
              <a 
                href={`/corretor/${dbUser.slug}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline font-bold text-sm block mt-1"
              >
                Ver meu Portfólio Público &rarr;
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Minha Conta
          </CardTitle>
          <CardDescription>Informações do seu perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-700">E-mail</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <form action={async () => {
          "use server";
          const supabase = await createClient();
          await supabase.auth.signOut();
          redirect("/login");
        }}>
          <Button variant="destructive" className="w-full" type="submit">
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </form>
      </div>
    </div>
  );
}
