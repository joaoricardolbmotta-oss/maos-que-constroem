'use client';

import { useState } from 'react';

interface Member {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}

interface MembersListProps {
  members: Member[];
  onUpdateRole: (id: string, role: 'owner' | 'editor' | 'viewer') => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ROLE_LABELS = {
  owner: { label: 'Proprietário', color: 'bg-red-100 text-red-800' },
  editor: { label: 'Editor', color: 'bg-blue-100 text-blue-800' },
  viewer: { label: 'Visualizador', color: 'bg-slate-100 text-slate-800' },
};

const ROLE_DESCRIPTIONS = {
  owner: 'Acesso total à campanha',
  editor: 'Pode editar receitas, despesas, etc',
  viewer: 'Pode apenas visualizar dados',
};

export function MembersList({ members, onUpdateRole, onRemove, isLoading }: MembersListProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Carregando membros...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500">Nenhum membro adicionado ainda</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left p-3 font-semibold text-slate-700">Email</th>
            <th className="text-left p-3 font-semibold text-slate-700">Role</th>
            <th className="text-left p-3 font-semibold text-slate-700">Descrição</th>
            <th className="text-center p-3 font-semibold text-slate-700">Ações</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
              <td className="p-3 text-slate-900 font-medium">{member.email}</td>
              <td className="p-3">
                <select
                  value={member.role}
                  onChange={(e) => {
                    setUpdating(member.id);
                    onUpdateRole(member.id, e.target.value as 'owner' | 'editor' | 'viewer').finally(
                      () => setUpdating(null)
                    );
                  }}
                  disabled={updating === member.id}
                  className="px-2 py-1 border border-slate-300 rounded text-xs font-medium disabled:bg-slate-100"
                >
                  <option value="owner">Proprietário</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Visualizador</option>
                </select>
              </td>
              <td className="p-3 text-slate-600 text-xs">{ROLE_DESCRIPTIONS[member.role]}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => {
                    if (confirm('Tem certeza que deseja remover este membro?')) {
                      setUpdating(member.id);
                      onRemove(member.id).finally(() => setUpdating(null));
                    }
                  }}
                  disabled={updating === member.id}
                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-xs font-medium disabled:text-slate-400"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
