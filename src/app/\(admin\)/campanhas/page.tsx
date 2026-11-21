'use client';

import { useState } from 'react';
import { useCampanhas } from '@/hooks/useCampanhas';
import { CampanhaForm } from '@/components/admin/CampanhaForm';
import { CampanhaList } from '@/components/admin/CampanhaList';
import { CampaignInput } from '@/lib/validators';
import { useRouter } from 'next/navigation';

type ModalMode = 'none' | 'create' | 'edit';

export default function CampanhasPage() {
  const router = useRouter();
  const { campanhas, isLoading, error, createCampanha, updateCampanha, deleteCampanha, getCampanha } =
    useCampanhas();
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [selectedCampanha, setSelectedCampanha] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreate = async (data: CampaignInput) => {
    try {
      setSubmitError(null);
      await createCampanha(data);
      setModalMode('none');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const campanha = await getCampanha(id);
      setSelectedCampanha(campanha);
      setModalMode('edit');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro ao buscar campanha');
    }
  };

  const handleUpdate = async (data: CampaignInput) => {
    if (!selectedCampanha) return;

    try {
      setSubmitError(null);
      await updateCampanha(selectedCampanha.id, data);
      setModalMode('none');
      setSelectedCampanha(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitError(null);
      await deleteCampanha(id);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro ao deletar');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campanhas</h1>
          <p className="mt-2 text-slate-600">Gerencie campanhas de arrecadação</p>
        </div>
        <button
          onClick={() => {
            setModalMode('create');
            setSelectedCampanha(null);
            setSubmitError(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nova Campanha
        </button>
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
              {modalMode === 'create' ? 'Nova Campanha' : 'Editar Campanha'}
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <CampanhaForm
              mode={modalMode}
              initial={selectedCampanha}
              onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
              onCancel={() => {
                setModalMode('none');
                setSelectedCampanha(null);
                setSubmitError(null);
              }}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow">
        <CampanhaList
          campanhas={campanhas}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
