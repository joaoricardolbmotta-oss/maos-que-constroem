'use client';

import Link from 'next/link';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ActivityFeed } from '@/components/admin/ActivityFeed';

export default function AdminPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Bem-vindo à Plataforma Mãos que Constroem</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/campanhas"
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">📢</div>
            <p className="font-semibold text-blue-900">Campanhas</p>
            <p className="text-xs text-blue-600 mt-1">Gerenciar campanhas</p>
          </Link>

          <Link
            href="/admin/campanhas?tab=receitas"
            className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">💰</div>
            <p className="font-semibold text-green-900">Receitas</p>
            <p className="text-xs text-green-600 mt-1">Doações arrecadadas</p>
          </Link>

          <Link
            href="/admin/campanhas?tab=despesas"
            className="p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">💸</div>
            <p className="font-semibold text-red-900">Despesas</p>
            <p className="text-xs text-red-600 mt-1">Gastos registrados</p>
          </Link>

          <Link
            href="/admin/campanhas?tab=doacoes"
            className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">📦</div>
            <p className="font-semibold text-purple-900">Doações</p>
            <p className="text-xs text-purple-600 mt-1">Bens doados</p>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Estatísticas</h2>
        <DashboardStats />
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Atividades Recentes</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <ActivityFeed />
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Sobre a Plataforma</h3>
        <p className="text-blue-800 text-sm">
          A Plataforma Mãos que Constroem é um sistema de prestação de contas e transparência para campanhas de arrecadação de fundos. Todos os dados de doadores são automaticamente mascarados na visualização pública para proteger a privacidade.
        </p>
      </div>
    </div>
  );
}
