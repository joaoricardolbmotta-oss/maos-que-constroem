'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import { OrcamentoForm } from '@/components/admin/OrcamentoForm';
import { OrcamentoList } from '@/components/admin/OrcamentoList';
import { OrcamentoInput } from '@/lib/validators';

type ModalMode = 'none' | 'create' | 'edit';

export default function OrcamentoPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const { orcamentos, isLoading, error, createOrcamento, updateOrcamento, deleteOrcamento } =
    useOrcamentos(campaignId);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [selectedOrcamento, setSelectedOrcamento] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreate = async (data: OrcamentoInput) => {
    try {
      setSubmitError(null);
      await createOrcamento(data);
      setModalMode('none');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleEdit = (id: string) => {
    const orcamento = orcamentos.find((o) => o.id === id);
    if (orcamento) {
      setSelectedOrcamento(orcamento);
      setModalMode('edit');
    }
  };

  const handleUpdate = async (data: OrcamentoInput) => {
    if (!selectedOrcamento) return;

    try {
      setSubmitError(null);
      await updateOrcamento(selectedOrcamento.id, data);
      setModalMode('none');
      setSelectedOrcamento(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitError(null);
      await deleteOrcamento(id);
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
            <h1 className="text-3xl font-bold text-slate-900">Orçamento</h1>
            <p className="mt-2 text-slate-600">Planeje e acompanhe os gastos da campanha</p>
          </div>
          <button
            onClick={() => {
              setModalMode('create');
              setSelectedOrcamento(null);
              setSubmitError(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Criar Item
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
              {modalMode === 'create' ? 'Criar Item de Orçamento' : 'Editar Item de Orçamento'}
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <OrcamentoForm
              mode={modalMode}
              initial={selectedOrcamento}
              onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
              onCancel={() => {
                setModalMode('none');
                setSelectedOrcamento(null);
                setSubmitError(null);
              }}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow p-6">
        <OrcamentoList
          orcamentos={orcamentos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-purple-800 text-sm">
          <strong>💡 Dica:</strong> Use o orçamento para planejar seus gastos e acompanhar a variação entre o estimado e o real. Isso ajuda na transparência e accountability.
        </p>
      </div>
    </div>
  );
}
