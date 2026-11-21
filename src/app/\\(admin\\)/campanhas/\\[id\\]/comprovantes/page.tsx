'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useComprovantes } from '@/hooks/useComprovantes';
import { ComprovantesUpload } from '@/components/admin/ComprovantesUpload';
import { ComprovantesGallery } from '@/components/admin/ComprovantesGallery';

export default function ComprovantesPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const { comprovantes, isLoading, error, uploadComprovante, deleteComprovante, getDownloadUrl } =
    useComprovantes(campaignId);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async (file: File, description?: string) => {
    try {
      setUploadError(null);
      await uploadComprovante(file, 'campanha', campaignId, description);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setUploadError(errorMessage);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este comprovante?')) return;

    try {
      setDeletingId(id);
      await deleteComprovante(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar';
      setUploadError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const downloadUrl = await getDownloadUrl(id);
      window.open(downloadUrl, '_blank');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao baixar';
      setUploadError(errorMessage);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/admin/campanhas" className="text-blue-600 hover:text-blue-700">
            ← Voltar para Campanhas
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Comprovantes</h1>
          <p className="mt-2 text-slate-600">Gerencie e organize os comprovantes da campanha</p>
        </div>
      </div>

      {/* General Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Enviar Comprovante</h2>
        {uploadError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{uploadError}</p>
          </div>
        )}
        <ComprovantesUpload
          entity_type="campanha"
          entity_id={campaignId}
          onUpload={handleUpload}
        />
      </div>

      {/* Gallery Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Comprovantes da Campanha ({comprovantes.length})
        </h2>
        <ComprovantesGallery
          comprovantes={comprovantes}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isLoading={isLoading || deletingId !== null}
        />
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>💡 Dica:</strong> Você pode anexar comprovantes de receitas, despesas e doações individuais através de suas páginas de edição, ou adicionar comprovantes gerais da campanha aqui.
        </p>
      </div>
    </div>
  );
}
