'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDespesas } from '@/hooks/useDespesas';
import { DespesaForm } from '@/components/admin/DespesaForm';
import { DespesaList } from '@/components/admin/DespesaList';
import { DespesaInput } from '@/lib/validators';

type ModalMode = 'none' | 'create' | 'edit';

export default function DespesasPage() {
  const params = useParams();
  const campaignId = params['id'] as string;

  const { despesas, isLoading, error, createDespesa, updateDespesa, deleteDespesa } =
    useDespesas(campaignId);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [selectedDespesa, setSelectedDespesa] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreate = async (data: DespesaInput) => {
    try {
      setSubmitError(null);
      await createDespesa(data);
      setModalMode('none');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleEdit = (id: string) => {
    const despesa = despesas.find((d) => d.id === id);
    if (despesa) {
      setSelectedDespesa(despesa);
      setModalMode('edit');
    }
  };

  const handleUpdate = async (data: DespesaInput) => {
    if (!selectedDespesa) return;

    try {
      setSubmitError(null);
      await updateDespesa(selectedDespesa.id, data);
      setModalMode('none');
      setSelectedDespesa(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitError(null);
      await deleteDespesa(id);
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
            <h1 className="text-3xl font-bold text-slate-900">Despesas</h1>
            <p className="mt-2 text-slate-600">Registre gastos e despesas da campanha</p>
          </div>
          <button
            onClick={() => {
              setModalMode('create');
              setSelectedDespesa(null);
              setSubmitError(null);
            }}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            + Registrar Despesa
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
              {modalMode === 'create' ? 'Registrar Despesa' : 'Editar Despesa'}
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <DespesaForm
              mode={modalMode}
              initial={selectedDespesa}
              onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
              onCancel={() => {
                setModalMode('none');
                setSelectedDespesa(null);
                setSubmitError(null);
              }}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow p-6">
        <DespesaList
          despesas={despesas}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>💡 Dica:</strong> As despesas serão exibidas publicamente com fornecedor mascarado automaticamente para privacidade.
        </p>
      </div>
    </div>
  );
}
