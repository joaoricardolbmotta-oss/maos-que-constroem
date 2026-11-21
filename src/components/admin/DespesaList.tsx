'use client';

import { Despesa } from '@/types/database';
import { currency } from '@/lib/currency';
import { dateUtils } from '@/lib/date';
import { privacy } from '@/lib/privacy';

interface DespesaListProps {
  despesas: Despesa[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function DespesaList({ despesas, onEdit, onDelete, isLoading }: DespesaListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
          <p className="mt-4 text-slate-600">Carregando despesas...</p>
        </div>
      </div>
    );
  }

  if (despesas.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-600 mb-2">Nenhuma despesa registrada</p>
        <p className="text-sm text-slate-500">Clique em "Registrar Despesa" para adicionar</p>
      </div>
    );
  }

  const totalGasto = despesas.reduce((sum, d) => sum + d.amount, 0);

  // Despesas por categoria
  const porCategoria = despesas.reduce(
    (acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + d.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">
          <strong>Total Gasto:</strong> {currency.formatBRL(totalGasto)}
        </p>
      </div>

      {/* Categories breakdown */}
      {Object.keys(porCategoria).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(porCategoria).map(([categoria, total]) => (
            <div key={categoria} className="bg-slate-100 rounded-lg p-3">
              <p className="text-xs text-slate-600 font-medium uppercase">{categoria}</p>
              <p className="text-lg font-semibold text-slate-900">{currency.formatBRL(total)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Descrição</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Categoria</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Fornecedor</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Valor</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Data</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {despesas.map((despesa) => (
              <tr key={despesa.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{despesa.description}</td>
                <td className="px-4 py-3 text-slate-600 text-sm">
                  <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                    {despesa.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 text-sm">{privacy.maskName(despesa.vendor_name)}</td>
                <td className="px-4 py-3 text-right font-semibold text-red-600">
                  {currency.formatBRL(despesa.amount)}
                </td>
                <td className="px-4 py-3 text-slate-600 text-sm">{dateUtils.formatDate(despesa.expense_date)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(despesa.id)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja deletar esta despesa?')) {
                          onDelete(despesa.id);
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
