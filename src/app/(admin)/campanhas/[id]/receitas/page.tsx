'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useReceitas } from '@/hooks/useReceitas';
import { ReceitaForm } from '@/components/admin/ReceitaForm';
import { ReceitaList } from '@/components/admin/ReceitaList';
import { ReceitaInput } from '@/lib/validators';

type ModalMode = 'none' | 'create' | 'edit';

export default function ReceitasPage() {
  const params = useParams();
  const campaignId = params['id'] as string;

  const { receitas, isLoading, error, createReceita, updateReceita, deleteReceita } =
    useReceitas(campaignId);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [selectedReceita, setSelectedReceita] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreate = async (data: ReceitaInput) => {
    try {
      setSubmitError(null);
      await createReceita(data);
      setModalMode('none');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleEdit = (id: string) => {
    const receita = receitas.find((r) => r.id === id);
    if (receita) {
      setSelectedReceita(receita);
      setModalMode('edit');
    }
  };

  const handleUpdate = async (data: ReceitaInput) => {
    if (!selectedReceita) return;

    try {
      setSubmitError(null);
      await updateReceita(selectedReceita.id, data);
      setModalMode('none');
      setSelectedReceita(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitError(null);
      await deleteReceita(id);
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
            <h1 className="text-3xl font-bold text-slate-900">Receitas</h1>
            <p className="mt-2 text-slate-600">Registre doações e arrecadações da campanha</p>
          </div>
          <button
            onClick={() => {
              setModalMode('create');
              setSelectedReceita(null);
              setSubmitError(null);
            }}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            + Registrar Receita
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
              {modalMode === 'create' ? 'Registrar Receita' : 'Editar Receita'}
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <ReceitaForm
              mode={modalMode}
              initial={selectedReceita}
              onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
              onCancel={() => {
                setModalMode('none');
                setSelectedReceita(null);
                setSubmitError(null);
              }}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow p-6">
        <ReceitaList
          receitas={receitas}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>💡 Dica:</strong> As doações serão exibidas publicamente com nomes e CPFs mascarados automaticamente
          para privacidade.
        </p>
      </div>
    </div>
  );
}
