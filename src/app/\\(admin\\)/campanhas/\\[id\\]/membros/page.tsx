'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMembers } from '@/hooks/useMembers';
import { MembersList } from '@/components/admin/MembersList';
import { AddMemberForm } from '@/components/admin/AddMemberForm';

export default function MembrosPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const { members, isLoading, error, addMember, updateMember, removeMember } =
    useMembers(campaignId);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddMember = async (email: string, role: 'owner' | 'editor' | 'viewer') => {
    try {
      setAddError(null);
      await addMember(email, role);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setAddError(errorMessage);
      throw err;
    }
  };

  const handleUpdateRole = async (id: string, role: 'owner' | 'editor' | 'viewer') => {
    try {
      setAddError(null);
      await updateMember(id, role);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setAddError(errorMessage);
      throw err;
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setAddError(null);
      await removeMember(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setAddError(errorMessage);
      throw err;
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
          <h1 className="text-3xl font-bold text-slate-900">Membros da Campanha</h1>
          <p className="mt-2 text-slate-600">Gerencie quem tem acesso a esta campanha</p>
        </div>
      </div>

      {/* General Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Add Member Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Adicionar Novo Membro</h2>
        {addError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{addError}</p>
          </div>
        )}
        <AddMemberForm onAdd={handleAddMember} />
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs">
            <strong>💡 Roles:</strong> <strong>Proprietário</strong> (acesso total) |
            <strong>Editor</strong> (editar dados) | <strong>Visualizador</strong> (apenas leitura)
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Membros ({members.length})</h2>
        <MembersList
          members={members}
          onUpdateRole={handleUpdateRole}
          onRemove={handleRemove}
          isLoading={isLoading}
        />
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-purple-800 text-sm">
          <strong>💡 Dica:</strong> Você pode adicionar múltiplos membros com diferentes níveis de acesso. Proprietários podem gerenciar membros, editores podem criar/editar dados, e visualizadores podem apenas ver.
        </p>
      </div>
    </div>
  );
}
