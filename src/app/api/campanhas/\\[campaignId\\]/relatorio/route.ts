import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/campanhas/:campaignId/relatorio?format=csv|json
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();
    const format = request.nextUrl.searchParams.get('format') || 'json';

    // Busca campanha
    const { data: campaign } = await supabase
      .from('campanhas')
      .select('*')
      .eq('id', params.campaignId)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Busca dados
    const [receitas, despesas, doacoes, orcamentos] = await Promise.all([
      supabase
        .from('receitas')
        .select('*')
        .eq('campaign_id', params.campaignId),
      supabase
        .from('despesas')
        .select('*')
        .eq('campaign_id', params.campaignId),
      supabase
        .from('doacoes_materiais')
        .select('*')
        .eq('campaign_id', params.campaignId),
      supabase
        .from('orcamento_itens')
        .select('*')
        .eq('campaign_id', params.campaignId),
    ]);

    const data = {
      campaign,
      receitas: receitas.data || [],
      despesas: despesas.data || [],
      doacoes: doacoes.data || [],
      orcamentos: orcamentos.data || [],
      resumo: {
        totalArrecadado: (receitas.data || []).reduce((sum, r) => sum + r.amount, 0),
        totalGasto: (despesas.data || []).reduce((sum, d) => sum + d.amount, 0),
        totalDoacoes: (doacoes.data || []).length,
        totalOrcado: (orcamentos.data || []).reduce((sum, o) => sum + o.estimated_amount, 0),
        totalGastoReal: (orcamentos.data || []).reduce((sum, o) => sum + (o.actual_amount || 0), 0),
      },
    };

    if (format === 'csv') {
      return generateCSVReport(data);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Generate relatorio error:', error);
    return NextResponse.json({ error: 'Erro ao gerar relatório' }, { status: 500 });
  }
}

function generateCSVReport(data: any) {
  const lines: string[] = [];

  // Header
  lines.push(`Relatório da Campanha: ${data.campaign.title}`);
  lines.push(`Gerado em: ${new Date().toLocaleString('pt-BR')}`);
  lines.push('');

  // Resumo
  lines.push('RESUMO EXECUTIVO');
  lines.push(`Total Arrecadado,${data.resumo.totalArrecadado.toFixed(2)}`);
  lines.push(`Total Gasto,${data.resumo.totalGasto.toFixed(2)}`);
  lines.push(`Saldo,${(data.resumo.totalArrecadado - data.resumo.totalGasto).toFixed(2)}`);
  lines.push(`Total de Doações (bens),${data.resumo.totalDoacoes}`);
  lines.push('');

  // Receitas
  lines.push('RECEITAS');
  lines.push('Descrição,Fonte,Valor,Data');
  data.receitas.forEach((r: any) => {
    lines.push(`"${r.description}","${r.source}",${r.amount.toFixed(2)},${r.created_at}`);
  });
  lines.push('');

  // Despesas
  lines.push('DESPESAS');
  lines.push('Descrição,Categoria,Valor,Data');
  data.despesas.forEach((d: any) => {
    lines.push(`"${d.description}","${d.category}",${d.amount.toFixed(2)},${d.created_at}`);
  });
  lines.push('');

  // Orçamento
  lines.push('ORÇAMENTO');
  lines.push('Descrição,Categoria,Orçado,Real,Variação');
  data.orcamentos.forEach((o: any) => {
    const variation = o.estimated_amount - (o.actual_amount || 0);
    lines.push(
      `"${o.description}","${o.category}",${o.estimated_amount.toFixed(2)},${(o.actual_amount || 0).toFixed(2)},${variation.toFixed(2)}`
    );
  });

  const csv = lines.join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="relatorio_${data.campaign.public_slug}_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
