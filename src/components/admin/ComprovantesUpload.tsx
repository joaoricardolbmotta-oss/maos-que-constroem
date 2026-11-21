'use client';

import { useRef, useState } from 'react';

interface ComprovantesUploadProps {
  entity_type: string;
  entity_id: string;
  onUpload: (file: File, description?: string) => Promise<void>;
}

export function ComprovantesUpload({
  entity_type,
  entity_id,
  onUpload,
}: ComprovantesUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(file, description || undefined);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border border-dashed border-slate-300 rounded-lg p-6">
      <div className="flex flex-col gap-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Selecionar Arquivo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:file:bg-slate-200
              disabled:file:text-slate-600"
          />
          <p className="mt-1 text-xs text-slate-500">
            Formatos aceitos: PDF, Imagens (JPG, PNG), Documentos (DOC, DOCX, XLS, XLSX)
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descrição (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Recibo de pagamento"
            disabled={isUploading}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 text-sm"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Status */}
        {isUploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin h-4 w-4 border-2 border-blue-200 border-t-blue-600 rounded-full" />
            <span className="text-sm">Enviando arquivo...</span>
          </div>
        )}
      </div>
    </div>
  );
}
