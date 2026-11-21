'use client';

import { useEffect, useState } from 'react';
import { formatBRL } from '@/lib/currency';

interface DashboardStats {
  campanhas: {
    total: number;
    ativas: number;
    planejadas: number;
    rascunhos: number;
  };
  receitas: {
    total: number;
    totalArrecadado: number;
    mediaDoacao: number;
  };
  despesas: {
    total: number;
    totalGasto: number;
    mediaGasto: number;
  };
  doacoes: {
    total: number;
    categorias: number;
  };
  saldo: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-slate-500">Carregando estatísticas...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">{error || 'Erro ao carregar estatísticas'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
          <p className="text-sm font-medium text-green-700">Total Arrecadado</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{formatBRL(stats.receitas.totalArrecadado)}</p>
          <p className="text-xs text-green-600 mt-2">{stats.receitas.total} doação(ões)</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-6 border border-red-200">
          <p className="text-sm font-medium text-red-700">Total Gasto</p>
          <p className="text-3xl font-bold text-red-900 mt-2">{formatBRL(stats.despesas.totalGasto)}</p>
          <p className="text-xs text-red-600 mt-2">{stats.despesas.total} gasto(s)</p>
        </div>

        <div
          className={`bg-gradient-to-br rounded-lg shadow p-6 border ${
            stats.saldo >= 0
              ? 'from-blue-50 to-blue-100 border-blue-200'
              : 'from-orange-50 to-orange-100 border-orange-200'
          }`}
        >
          <p className={`text-sm font-medium ${stats.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            Saldo
          </p>
          <p className={`text-3xl font-bold mt-2 ${stats.saldo >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
            {formatBRL(stats.saldo)}
          </p>
          <p className={`text-xs mt-2 ${stats.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {stats.saldo >= 0 ? 'Superávit' : 'Déficit'}
          </p>
        </div>
      </div>

      {/* Campaigns Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Campanhas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-600">Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.campanhas.total}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs font-medium text-green-600">Ativas</p>
            <p className="text-2xl font-bold text-green-900 mt-2">{stats.campanhas.ativas}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-600">Planejadas</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{stats.campanhas.planejadas}</p>
          </div>
          <div className="p-4 bg-slate-100 rounded-lg">
            <p className="text-xs font-medium text-slate-600">Rascunhos</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats.campanhas.rascunhos}</p>
          </div>
        </div>
      </div>

      {/* Average Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-slate-600">Média por Doação</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatBRL(stats.receitas.mediaDoacao)}</p>
          <p className="text-xs text-slate-500 mt-2">baseado em {stats.receitas.total} doação(ões)</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-slate-600">Média por Despesa</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatBRL(stats.despesas.mediaGasto)}</p>
          <p className="text-xs text-slate-500 mt-2">baseado em {stats.despesas.total} gasto(s)</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-slate-600">Total de Doações (Bens)</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.doacoes.total}</p>
          <p className="text-xs text-slate-500 mt-2">{stats.doacoes.categorias} categoria(s)</p>
        </div>
      </div>
    </div>
  );
}
