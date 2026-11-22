'use client';

import Link from 'next/link';
import { Campanha } from '@/types/database';
import { dateUtils } from '@/lib/date';
import { currency } from '@/lib/currency';

interface CampanhaListProps {
  campanhas: Campanha[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function CampanhaList({ campanhas, onEdit, onDelete, isLoading }: CampanhaListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
          <p className="mt-4 text-slate-600">Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  if (campanhas.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-600 mb-2">Nenhuma campanha criada ainda</p>
        <p className="text-sm text-slate-500">Clique no botão "Nova Campanha" para começar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-3 text-left font-semibold text-slate-900">Nome</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-900">Status</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-900">Data</th>
            <th className="px-6 py-3 text-left font-semibold text-slate-900">Meta</th>
            <th className="px-6 py-3 text-right font-semibold text-slate-900">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {campanhas.map((campanha) => (
            <tr key={campanha.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-900">{campanha.title}</p>
                  <p className="text-xs text-slate-500">/{campanha.public_slug}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    campanha.status === 'draft'
                      ? 'bg-gray-100 text-gray-700'
                      : campanha.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : campanha.status === 'planned'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {dateUtils.getCampaignStatusLabel(campanha.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600">
                {dateUtils.formatCampaignDate(campanha.date_mode, campanha.action_date, campanha.end_date)}
              </td>
              <td className="px-6 py-4 text-slate-600">
                {campanha.fundraising_goal ? currency.formatBRL(campanha.fundraising_goal) : '—'}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-1 flex-wrap">
                  <Link
                    href={`/admin/campanhas/${campanha.id}/receitas`}
                    className="px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded transition-colors"
                  >
                    Receitas
                  </Link>
                  <Link
                    href={`/admin/campanhas/${campanha.id}/despesas`}
                    className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Despesas
                  </Link>
                  <Link
                    href={`/admin/campanhas/${campanha.id}/doacoes`}
                    className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    Doações
                  </Link>
                  <Link
                    href={`/admin/campanhas/${campanha.id}/orcamento`}
                    className="px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  >
                    Orçamento
                  </Link>
                  <Link
                    href={`/admin/campanhas/${campanha.id}/comprovantes`}
                    className="px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  >
                    Comprovantes
                  </Link>
                  <Link
                    href={`/admin/campanhas/${campanha.id}/relatorio`}
                    className="px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                  >
                    Relatório
                  </Link>
                  <Link
                    href={`/admin/campanhas/${campanha.id}/membros`}
                    className="px-2 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded transition-colors"
                  >
                    Membros
                  </Link>
                  <button
                    onClick={() => onEdit(campanha.id)}
                    className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja deletar esta campanha?')) {
                        onDelete(campanha.id);
                      }
                    }}
                    className="px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 rounded transition-colors"
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
  );
}
