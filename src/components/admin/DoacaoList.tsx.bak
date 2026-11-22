'use client';

import { DoacaoMaterial } from '@/types/database';
import { maskName, maskCPF } from '@/lib/privacy';
import { formatDate } from '@/lib/date';

interface DoacaoListProps {
  doacoes: DoacaoMaterial[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const CATEGORIES = {
  alimentos: { label: 'Alimentos', color: 'bg-green-100 text-green-800' },
  higiene: { label: 'Higiene e Limpeza', color: 'bg-blue-100 text-blue-800' },
  roupas: { label: 'Roupas e Acessórios', color: 'bg-purple-100 text-purple-800' },
  brinquedos: { label: 'Brinquedos', color: 'bg-pink-100 text-pink-800' },
  outros: { label: 'Outros', color: 'bg-slate-100 text-slate-800' },
};

export function DoacaoList({ doacoes, onEdit, onDelete, isLoading }: DoacaoListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Carregando doações...</p>
      </div>
    );
  }

  if (doacoes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">Nenhuma doação registrada ainda</p>
        <p className="text-slate-400 text-sm mt-2">Clique em "Registrar Doação" para começar</p>
      </div>
    );
  }

  // Calculate totals by category
  const categoryTotals = doacoes.reduce(
    (acc, doacao) => {
      if (!acc[doacao.category]) {
        acc[doacao.category] = 0;
      }
      acc[doacao.category] += doacao.quantity;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
          <div key={key} className={`p-4 rounded-lg ${color}`}>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold mt-2">{categoryTotals[key] || 0}</p>
          </div>
        ))}
      </div>

      {/* Donations Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-700">Item</th>
              <th className="text-left p-3 font-semibold text-slate-700">Categoria</th>
              <th className="text-center p-3 font-semibold text-slate-700">Qtd</th>
              <th className="text-left p-3 font-semibold text-slate-700">Unidade</th>
              <th className="text-left p-3 font-semibold text-slate-700">Doador</th>
              <th className="text-left p-3 font-semibold text-slate-700">CPF</th>
              <th className="text-left p-3 font-semibold text-slate-700">Data</th>
              <th className="text-center p-3 font-semibold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {doacoes.map((doacao) => (
              <tr key={doacao.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                <td className="p-3 text-slate-900 font-medium">{doacao.item_name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${CATEGORIES[doacao.category].color}`}
                  >
                    {CATEGORIES[doacao.category].label}
                  </span>
                </td>
                <td className="p-3 text-center font-semibold text-slate-900">{doacao.quantity}</td>
                <td className="p-3 text-slate-700">{doacao.unit || '-'}</td>
                <td className="p-3 text-slate-700">{doacao.donor_name ? maskName(doacao.donor_name) : '-'}</td>
                <td className="p-3 text-slate-700">{doacao.donor_cpf ? maskCPF(doacao.donor_cpf) : '-'}</td>
                <td className="p-3 text-slate-700">{formatDate(doacao.received_date)}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => onEdit(doacao.id)}
                    className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja deletar esta doação?')) {
                        onDelete(doacao.id);
                      }
                    }}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-xs font-medium"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Card */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>📦 Total de Doações:</strong> {doacoes.length} item(ns) registrado(s)
        </p>
      </div>
    </div>
  );
}
