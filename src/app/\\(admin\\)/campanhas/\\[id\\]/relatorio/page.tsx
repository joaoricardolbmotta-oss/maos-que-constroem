'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function RelatorioPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      setError(null);

      const response = await fetch(`/api/campanhas/${campaignId}/relatorio?format=csv`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      // Cria download do arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${campaignId}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setIsExporting(true);
      setError(null);

      const response = await fetch(`/api/campanhas/${campaignId}/relatorio?format=json`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar relatório');
      }

      const data = await response.json();

      // Cria download do arquivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${campaignId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/admin/campanhas" className="text-blue-600 hover:text-blue-700">
            ← Voltar para Campanhas
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
          <p className="mt-2 text-slate-600">Exporte e visualize relatórios da campanha</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-3xl">📊</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Exportar como CSV</h2>
              <p className="text-slate-600 text-sm mt-1">
                Exporte todos os dados em formato CSV para análise em planilhas
              </p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? 'Gerando...' : 'Baixar CSV'}
          </button>
        </div>

        {/* JSON Export */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-3xl">📄</div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Exportar como JSON</h2>
              <p className="text-slate-600 text-sm mt-1">
                Exporte os dados em formato JSON para integração com outros sistemas
              </p>
            </div>
          </div>
          <button
            onClick={handleExportJSON}
            disabled={isExporting}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? 'Gerando...' : 'Baixar JSON'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>💡 Dica:</strong> Os relatórios incluem todas as receitas, despesas, doações e informações de orçamento. Use CSV para análise em Excel e JSON para integração com sistemas externos.
        </p>
      </div>
    </div>
  );
}
