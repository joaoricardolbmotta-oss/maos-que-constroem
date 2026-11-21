'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDoacoes } from '@/hooks/useDoacoes';
import { DoacaoForm } from '@/components/admin/DoacaoForm';
import { DoacaoList } from '@/components/admin/DoacaoList';
import { DoacaoInput } from '@/lib/validators';

type ModalMode = 'none' | 'create' | 'edit';

export default function DoacoesPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const { doacoes, isLoading, error, createDoacao, updateDoacao, deleteDoacao } =
    useDoacoes(campaignId);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [selectedDoacao, setSelectedDoacao] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreate = async (data: DoacaoInput) => {
    try {
      setSubmitError(null);
      await createDoacao(data);
      setModalMode('none');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleEdit = (id: string) => {
    const doacao = doacoes.find((d) => d.id === id);
    if (doacao) {
      setSelectedDoacao(doacao);
      setModalMode('edit');
    }
  };

  const handleUpdate = async (data: DoacaoInput) => {
    if (!selectedDoacao) return;

    try {
      setSubmitError(null);
      await updateDoacao(selectedDoacao.id, data);
      setModalMode('none');
      setSelectedDoacao(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitError(null);
      await deleteDoacao(id);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro ao deletar');
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Doações Materiais</h1>
            <p className="mt-2 text-slate-600">Registre doações de bens e materiais</p>
          </div>
          <button
            onClick={() => {
              setModalMode('create');
              setSelectedDoacao(null);
              setSubmitError(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Registrar Doação
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Modal */}
      {modalMode !== 'none' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {modalMode === 'create' ? 'Registrar Doação Material' : 'Editar Doação Material'}
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <DoacaoForm
              mode={modalMode}
              initial={selectedDoacao}
              onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
              onCancel={() => {
                setModalMode('none');
                setSelectedDoacao(null);
                setSubmitError(null);
              }}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow p-6">
        <DoacaoList
          doacoes={doacoes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 text-sm">
          <strong>💡 Dica:</strong> As doações serão exibidas publicamente com informações do doador mascaradas automaticamente para privacidade.
        </p>
      </div>
    </div>
  );
}
