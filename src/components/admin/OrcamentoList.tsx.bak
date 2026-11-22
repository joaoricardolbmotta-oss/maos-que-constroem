'use client';

import { OrcamentoItem } from '@/types/database';
import { formatBRL } from '@/lib/currency';

interface OrcamentoListProps {
  orcamentos: OrcamentoItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const CATEGORIES = {
  transporte: { label: 'Transporte', color: 'bg-blue-100 text-blue-800' },
  alimentacao: { label: 'Alimentação', color: 'bg-green-100 text-green-800' },
  materiais: { label: 'Materiais', color: 'bg-yellow-100 text-yellow-800' },
  comunicacao: { label: 'Comunicação', color: 'bg-purple-100 text-purple-800' },
  'infraestrutura': { label: 'Infraestrutura', color: 'bg-red-100 text-red-800' },
  'recursos-humanos': { label: 'Recursos Humanos', color: 'bg-pink-100 text-pink-800' },
  outros: { label: 'Outros', color: 'bg-slate-100 text-slate-800' },
};

export function OrcamentoList({ orcamentos, onEdit, onDelete, isLoading }: OrcamentoListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-slate-500">Carregando orçamentos...</p>
      </div>
    );
  }

  if (orcamentos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 text-lg">Nenhum item de orçamento registrado ainda</p>
        <p className="text-slate-400 text-sm mt-2">Clique em "Criar Item" para começar</p>
      </div>
    );
  }

  // Calculate totals
  const totalEstimated = orcamentos.reduce((sum, item) => sum + item.estimated_amount, 0);
  const totalActual = orcamentos.reduce((sum, item) => sum + (item.actual_amount || 0), 0);
  const difference = totalEstimated - totalActual;

  // Calculate by category
  const categoryTotals = orcamentos.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { estimated: 0, actual: 0 };
      }
      acc[item.category].estimated += item.estimated_amount;
      acc[item.category].actual += item.actual_amount || 0;
      return acc;
    },
    {} as Record<string, { estimated: number; actual: number }>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-700">Orçado Total</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">{formatBRL(totalEstimated)}</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-700">Gasto Real</p>
          <p className="text-2xl font-bold text-green-900 mt-2">{formatBRL(totalActual)}</p>
        </div>
        <div className={`p-4 rounded-lg ${difference >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm font-medium ${difference >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            {difference >= 0 ? 'Economia' : 'Excesso'}
          </p>
          <p className={`text-2xl font-bold mt-2 ${difference >= 0 ? 'text-green-900' : 'text-red-900'}`}>
            {formatBRL(Math.abs(difference))}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Resumo por Categoria</h3>
        <div className="space-y-2">
          {Object.entries(categoryTotals).map(([category, totals]) => {
            const categoryInfo = CATEGORIES[category as keyof typeof CATEGORIES];
            return (
              <div key={category} className="flex items-center justify-between p-2 hover:bg-white rounded">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${categoryInfo.color}`}>
                    {categoryInfo.label}
                  </span>
                  <span className="text-sm text-slate-600">Orçado: {formatBRL(totals.estimated)}</span>
                </div>
                <span className="text-sm text-slate-600">Gasto: {formatBRL(totals.actual)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-3 font-semibold text-slate-700">Descrição</th>
              <th className="text-left p-3 font-semibold text-slate-700">Categoria</th>
              <th className="text-right p-3 font-semibold text-slate-700">Orçado</th>
              <th className="text-right p-3 font-semibold text-slate-700">Real</th>
              <th className="text-right p-3 font-semibold text-slate-700">Variação</th>
              <th className="text-center p-3 font-semibold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orcamentos.map((item) => {
              const variation = item.estimated_amount - (item.actual_amount || 0);
              const categoryInfo = CATEGORIES[item.category as keyof typeof CATEGORIES];
              return (
                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                  <td className="p-3 text-slate-900">
                    <div className="font-medium">{item.description}</div>
                    {item.notes && <div className="text-xs text-slate-500 mt-1">{item.notes}</div>}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                      {categoryInfo.label}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold text-slate-900">
                    {formatBRL(item.estimated_amount)}
                  </td>
                  <td className="p-3 text-right font-semibold text-slate-900">
                    {item.actual_amount ? formatBRL(item.actual_amount) : '-'}
                  </td>
                  <td className={`p-3 text-right font-semibold ${variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatBRL(Math.abs(variation))}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => onEdit(item.id)}
                      className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition text-xs font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja deletar este item?')) {
                          onDelete(item.id);
                        }
                      }}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-xs font-medium"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
