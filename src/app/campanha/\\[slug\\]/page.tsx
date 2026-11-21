import { supabaseServer } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { formatDate, formatCampaignDate } from '@/lib/date';
import { formatBRL } from '@/lib/currency';
import { maskName, maskCPF } from '@/lib/privacy';
import Link from 'next/link';

interface CampaignPageProps {
  params: { slug: string };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function CampaignPage({ params }: CampaignPageProps) {
  const supabase = supabaseServer();

  // Busca a campanha pelo slug
  const { data: campaign, error: campaignError } = await supabase
    .from('campanhas')
    .select('*')
    .eq('public_slug', params.slug)
    .single();

  if (campaignError || !campaign) {
    notFound();
  }

  // Busca receitas
  const { data: receitas = [] } = await supabase
    .from('receitas')
    .select('*')
    .eq('campaign_id', campaign.id);

  // Busca despesas
  const { data: despesas = [] } = await supabase
    .from('despesas')
    .select('*')
    .eq('campaign_id', campaign.id);

  // Busca doações
  const { data: doacoes = [] } = await supabase
    .from('doacoes_materiais')
    .select('*')
    .eq('campaign_id', campaign.id);

  // Busca orçamentos
  const { data: orcamentos = [] } = await supabase
    .from('orcamento_itens')
    .select('*')
    .eq('campaign_id', campaign.id);

  // Calcula totais
  const totalReceitas = receitas.reduce((sum, r) => sum + r.amount, 0);
  const totalDespesas = despesas.reduce((sum, d) => sum + d.amount, 0);
  const totalOrcado = orcamentos.reduce((sum, o) => sum + o.estimated_amount, 0);
  const totalGasto = orcamentos.reduce((sum, o) => sum + (o.actual_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
            ← Voltar
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">{campaign.title}</h1>
          <p className="mt-2 text-slate-600">{campaign.description}</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 ${
                  campaign.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : campaign.status === 'planned'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-700'
                }`}
              >
                {campaign.status === 'active' ? 'Ativa' : campaign.status === 'planned' ? 'Planejada' : 'Rascunho'}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Período</p>
              <p className="font-medium mt-1">
                {formatCampaignDate(campaign.date_mode, campaign.action_date, campaign.end_date)}
              </p>
            </div>
            {campaign.fundraising_goal && (
              <div>
                <p className="text-sm text-slate-500">Meta</p>
                <p className="font-medium mt-1">{formatBRL(campaign.fundraising_goal)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-slate-600">Arrecadado</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{formatBRL(totalReceitas)}</p>
            <p className="text-xs text-slate-500 mt-1">{receitas.length} doação(ões)</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-slate-600">Despesas</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{formatBRL(totalDespesas)}</p>
            <p className="text-xs text-slate-500 mt-1">{despesas.length} gasto(s)</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-slate-600">Doações de Bens</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{doacoes.length}</p>
            <p className="text-xs text-slate-500 mt-1">item(ns) registrado(s)</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-slate-600">Saldo</p>
            <p className={`text-3xl font-bold mt-2 ${totalReceitas - totalDespesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatBRL(totalReceitas - totalDespesas)}
            </p>
          </div>
        </div>

        {/* Receitas Section */}
        {receitas.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Receitas (Doações)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left p-3 font-semibold text-slate-700">Descrição</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Fonte</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Doador</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Valor</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {receitas.map((receita) => (
                    <tr key={receita.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-3 text-slate-900 font-medium">{receita.description}</td>
                      <td className="p-3 text-slate-700">{receita.source}</td>
                      <td className="p-3 text-slate-700">
                        {receita.donor_name ? maskName(receita.donor_name) : '—'}
                      </td>
                      <td className="p-3 text-right font-semibold text-green-600">
                        {formatBRL(receita.amount)}
                      </td>
                      <td className="p-3 text-slate-700">{formatDate(receita.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Despesas Section */}
        {despesas.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Despesas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left p-3 font-semibold text-slate-700">Descrição</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Categoria</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Fornecedor</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Valor</th>
                    <th className="text-left p-3 font-semibold text-slate-700">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {despesas.map((despesa) => (
                    <tr key={despesa.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-3 text-slate-900 font-medium">{despesa.description}</td>
                      <td className="p-3 text-slate-700">{despesa.category}</td>
                      <td className="p-3 text-slate-700">
                        {despesa.vendor_name ? maskName(despesa.vendor_name) : '—'}
                      </td>
                      <td className="p-3 text-right font-semibold text-red-600">
                        {formatBRL(despesa.amount)}
                      </td>
                      <td className="p-3 text-slate-700">{formatDate(despesa.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doações Section */}
        {doacoes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Doações de Bens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doacoes.map((doacao) => (
                <div key={doacao.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">{doacao.item_name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {doacao.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    <strong>Quantidade:</strong> {doacao.quantity} {doacao.unit || 'unidade(s)'}
                  </p>
                  <p className="text-sm text-slate-600 mb-2">
                    <strong>Doador:</strong> {doacao.donor_name ? maskName(doacao.donor_name) : '—'}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(doacao.received_date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orçamento Summary */}
        {orcamentos.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Resumo do Orçamento</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Total Orçado</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">{formatBRL(totalOrcado)}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-700">Total Gasto</p>
                <p className="text-2xl font-bold text-green-900 mt-2">{formatBRL(totalGasto)}</p>
              </div>
              <div className={`p-4 rounded-lg ${totalOrcado - totalGasto >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium ${totalOrcado - totalGasto >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {totalOrcado - totalGasto >= 0 ? 'Economia' : 'Excesso'}
                </p>
                <p className={`text-2xl font-bold mt-2 ${totalOrcado - totalGasto >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {formatBRL(Math.abs(totalOrcado - totalGasto))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">
          <p>Mãos que Constroem - Plataforma de Transparência e Accountability</p>
          <p className="mt-2">Dados mascarados para proteger a privacidade dos doadores</p>
        </div>
      </div>
    </div>
  );
}
