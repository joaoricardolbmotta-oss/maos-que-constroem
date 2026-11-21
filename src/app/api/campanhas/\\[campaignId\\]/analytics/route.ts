import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/campanhas/:campaignId/analytics - Analytics da campanha
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const user = await requireAuth();

    const supabase = supabaseServer();
    const days = parseInt(request.nextUrl.searchParams.get('days') || '30');

    // Busca data de início
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Dados por dia
    const { data: dailyStats } = await supabase.rpc('get_daily_stats', {
      campaign_id: params.campaignId,
      start_date: startDate.toISOString(),
      end_date: new Date().toISOString(),
    });

    // Total de doadores
    const { data: donors } = await supabase
      .from('receitas')
      .select('donor_name', { count: 'exact' })
      .eq('campaign_id', params.campaignId)
      .neq('donor_name', null);

    // Top doadores
    const { data: topDonors } = await supabase.rpc('get_top_donors', {
      campaign_id: params.campaignId,
      limit_count: 10,
    });

    // Categorias mais gastas
    const { data: topCategories } = await supabase.rpc('get_top_expense_categories', {
      campaign_id: params.campaignId,
    });

    // Trending
    const { data: trending } = await supabase.rpc('get_trending', {
      campaign_id: params.campaignId,
      days_count: 7,
    });

    return NextResponse.json(
      {
        daily_stats: dailyStats || [],
        total_donors: donors?.length || 0,
        top_donors: topDonors || [],
        top_categories: topCategories || [],
        trending: trending || {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Erro ao buscar analytics' }, { status: 500 });
  }
}

/**
 * Função helper para rastrear eventos
 */
export async function trackAnalyticsEvent(
  campaignId: string,
  eventType: string,
  eventData: Record<string, any>
) {
  try {
    const supabase = supabaseServer();

    await supabase.from('analytics_events').insert([
      {
        campaign_id: campaignId,
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error('Track event error:', error);
    // Não lance erro aqui
  }
}

/**
 * Eventos customizados
 */
export async function trackDonation(campaignId: string, amount: number) {
  await trackAnalyticsEvent(campaignId, 'donation', { amount });
}

export async function trackExpense(campaignId: string, amount: number, category: string) {
  await trackAnalyticsEvent(campaignId, 'expense', { amount, category });
}

export async function trackPublicPageView(campaignSlug: string) {
  await trackAnalyticsEvent(campaignSlug, 'page_view', {
    page: 'public',
    timestamp: new Date().toISOString(),
  });
}

export async function trackCheckout(campaignId: string, sessionId: string) {
  await trackAnalyticsEvent(campaignId, 'checkout_started', { session_id: sessionId });
}

export async function trackPaymentSuccess(campaignId: string, amount: number) {
  await trackAnalyticsEvent(campaignId, 'payment_success', { amount });
}
