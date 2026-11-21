'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Bem-vindo à área administrativa</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campanhas Card */}
        <Link href="/admin/campanhas">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Campanhas</h2>
              <div className="text-3xl">🎯</div>
            </div>
            <p className="text-slate-600 mb-4">Gerenciar campanhas, receitas, despesas e orçamentos</p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              Ir para →
            </span>
          </div>
        </Link>

        {/* Portal Público Card */}
        <Link href="/campanha/acao-01">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg hover:scale-105 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Portal Público</h2>
              <div className="text-3xl">🌍</div>
            </div>
            <p className="text-slate-600 mb-4">Visualizar campanhas publicadas (versão pública)</p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              Visualizar →
            </span>
          </div>
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ Próximos Passos</h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Clique em "Campanhas" para criar uma nova campanha</li>
          <li>• Adicione receitas, despesas e itens de orçamento</li>
          <li>• Faça upload de comprovantes</li>
          <li>• O portal público mostrará os dados mascarados automaticamente</li>
        </ul>
      </div>
    </div>
  );
}
