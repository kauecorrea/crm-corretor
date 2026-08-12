"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Loader2, X, Download } from "lucide-react";
import { addDocumentAction } from "./actions";

export function ClientDocuments({ clientId, initialDocuments = [] }: { clientId: string, initialDocuments?: any[] }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const supabase = createClient();

    try {
      const fileExt = file.name.split('.').pop() || '';
      const fileName = `${clientId}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('crm_uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('crm_uploads')
        .getPublicUrl(fileName);

      startTransition(async () => {
        await addDocumentAction(clientId, file.name, publicUrl, fileExt);
      });

      const newDoc = {
        id: Math.random().toString(),
        name: file.name,
        fileUrl: publicUrl,
        type: fileExt,
        createdAt: new Date().toISOString()
      };
      setDocuments(prev => [newDoc, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao fazer upload. Verifique se o bucket 'crm_uploads' existe no Supabase.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="h-5 w-5" /> Documentos</h3>
      
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="doc-upload" className="cursor-pointer border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-slate-400 mb-2" />
            )}
            <span className="text-sm font-medium text-slate-600">
              {isUploading ? "Enviando arquivo..." : "Clique para fazer upload de PDF, JPG ou PNG"}
            </span>
          </Label>
          <Input 
            id="doc-upload" 
            type="file" 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      </div>
      
      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="space-y-2 mt-4">
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 bg-slate-50 rounded-lg">Nenhum documento anexado.</p>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between group hover:border-primary/50 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-md">
                  <FileText className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800 line-clamp-1">{doc.name}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(doc.createdAt).toLocaleDateString('pt-BR')} • {doc.type?.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
