import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';
import { analyzeCampaign, generateCampaignSummary, detectAnomalies } from '@/lib/ai-insights';

/**
 * GET /api/campanhas/:campaignId/ai-insights
 * Fase 36: AI-Powered Analytics
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const user = await requireAuth();
    const supabase = supabaseServer();

    // Get campaign with transactions
    const { data: campaign, error } = await supabase
      .from('campanhas')
      .select(`
        *,
        receitas (id, amount, created_at),
        despesas (id, amount, category, created_at),
        doacoes (id, amount, donor_name, created_at)
      `)
      .eq('id', params.campaignId)
      .single();

    if (error || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Prepare data for AI analysis
    const totalReceitas = (campaign.receitas || []).reduce((sum: number, r: any) => sum + r.amount, 0);
    const totalDespesas = (campaign.despesas || []).reduce((sum: number, d: any) => sum + d.amount, 0);
    const categoryBreakdown: Record<string, number> = {};

    (campaign.despesas || []).forEach((d: any) => {
      categoryBreakdown[d.category] = (categoryBreakdown[d.category] || 0) + d.amount;
    });

    // AI Analysis
    const analysis = await analyzeCampaign({
      title: campaign.title,
      description: campaign.description,
      totalReceitas,
      totalDespesas,
      donorCount: (campaign.doacoes || []).length,
      categoryBreakdown,
      timeSeriesData: [],
    });

    const summary = await generateCampaignSummary({
      title: campaign.title,
      totalReceitas,
      totalDespesas,
    });

    // Detect anomalies
    const allTransactions = [
      ...(campaign.receitas || []),
      ...(campaign.despesas || []),
      ...(campaign.doacoes || []),
    ];

    const anomalies = await detectAnomalies(allTransactions);

    return NextResponse.json(
      {
        analysis,
        summary,
        anomalies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ error: 'Error generating insights' }, { status: 500 });
  }
}
