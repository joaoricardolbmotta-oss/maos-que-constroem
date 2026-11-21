'use client';

import { Receita } from '@/types/database';
import { currency } from '@/lib/currency';
import { dateUtils } from '@/lib/date';
import { privacy } from '@/lib/privacy';

interface ReceitaListProps {
  receitas: Receita[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function ReceitaList({ receitas, onEdit, onDelete, isLoading }: ReceitaListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
          <p className="mt-4 text-slate-600">Carregando receitas...</p>
        </div>
      </div>
    );
  }

  if (receitas.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-600 mb-2">Nenhuma receita registrada</p>
        <p className="text-sm text-slate-500">Clique em "Registrar Receita" para adicionar</p>
      </div>
    );
  }

  const totalArrecadado = receitas.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700">
          <strong>Total Arrecadado:</strong> {currency.formatBRL(totalArrecadado)}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Descrição</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Origem</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Doador</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Valor</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Data</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {receitas.map((receita) => (
              <tr key={receita.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{receita.description}</td>
                <td className="px-4 py-3 text-slate-600 text-sm">{receita.source}</td>
                <td className="px-4 py-3 text-slate-600 text-sm">
                  <div>
                    <p>{privacy.maskName(receita.donor_name)}</p>
                    {receita.donor_cpf && <p className="text-xs text-slate-500">{privacy.maskCPF(receita.donor_cpf)}</p>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {currency.formatBRL(receita.amount)}
                </td>
                <td className="px-4 py-3 text-slate-600 text-sm">{dateUtils.formatDate(receita.receipt_date)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(receita.id)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja deletar esta receita?')) {
                          onDelete(receita.id);
                        }
                      }}
                      className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
