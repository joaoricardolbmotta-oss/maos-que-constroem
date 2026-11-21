import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/campanhas/:campaignId/reports - Reports Management
 * Fase 30+: PDF, CSV, JSON Reports
 */

export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const user = await requireAuth();
    const format = request.nextUrl.searchParams.get('format') || 'pdf'; // pdf, csv, json
    const days = parseInt(request.nextUrl.searchParams.get('days') || '30');

    const supabase = supabaseServer();

    // Get campaign with transactions
    const { data: campaign, error: campaignError } = await supabase
      .from('campanhas')
      .select(`
        *,
        receitas (id, description, amount, created_at, donor_name),
        despesas (id, description, amount, category, created_at),
        doacoes (id, amount, donor_name, created_at)
      `)
      .eq('id', params.campaignId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Calculate totals
    const totalReceitas = (campaign.receitas || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    const totalDespesas = (campaign.despesas || []).reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    const totalDoacoes = (campaign.doacoes || []).reduce((sum: number, d: any) => sum + (d.amount || 0), 0);

    const reportData = {
      campaignTitle: campaign.title,
      campaignDescription: campaign.description,
      reportDate: new Date(),
      totalReceitas,
      totalDespesas,
      totalDoacoes,
      donorCount: campaign.doacoes?.length || 0,
      categoryBreakdown: {},
      topDonors: [],
      recentTransactions: [],
    };

    return NextResponse.json(reportData, { status: 200 });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json({ error: 'Error generating reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const user = await requireAuth();
    const { format, days } = await request.json();

    const supabase = supabaseServer();

    // Store report generation request
    const { data, error } = await supabase.from('report_requests').insert([
      {
        campaign_id: params.campaignId,
        user_id: user.id,
        format: format || 'pdf',
        days: days || 30,
        status: 'processing',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Report generation started', data },
      { status: 202 }
    );
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Error creating report' }, { status: 500 });
  }
}
