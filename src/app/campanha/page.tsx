'use client';

import Link from 'next/link';

export default function CampanhasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="font-semibold text-slate-900">Mãos que Constroem</span>
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Área Administrativa
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Campanhas Ativas</h1>
        <p className="text-slate-600 mb-8">Acompanhe as campanhas de arrecadação em andamento</p>

        {/* Grid de Campanhas (placeholder) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Campaign Card 1 */}
          <Link href="/campanha/acao-01">
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-24" />

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Ação 01</h3>
                <p className="text-slate-600 text-sm mb-4">Campanha de arrecadação de outubro de 2024</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Progresso</span>
                    <span className="text-sm font-semibold text-blue-600">56%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '56%' }} />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm text-slate-600">
                  <p>Meta: R$ 4.048,00</p>
                  <p>Arrecadado: R$ 2.286,04</p>
                </div>

                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Detalhes →
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Empty State Info */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <strong>ℹ️ Nota:</strong> Campanhas em rascunho não aparecem publicamente. Use a área administrativa para
            publicar campanhas.
          </p>
        </div>
      </div>
    </div>
  );
}
