'use client';

import { useState } from 'react';

interface AddMemberFormProps {
  onAdd: (email: string, role: 'owner' | 'editor' | 'viewer') => Promise<void>;
}

export function AddMemberForm({ onAdd }: AddMemberFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'editor' | 'viewer'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onAdd(email, role);
      setEmail('');
      setRole('editor');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          disabled={isSubmitting}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 text-sm"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'owner' | 'editor' | 'viewer')}
          disabled={isSubmitting}
          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 text-sm"
        >
          <option value="owner">Proprietário</option>
          <option value="editor">Editor</option>
          <option value="viewer">Visualizador</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Membro'}
        </button>
      </div>
    </form>
  );
}
