import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';

const donateSchema = z.object({
  amount: z.number().min(100).max(100000000), // em centavos
  donor_name: z.string().optional(),
  donor_email: z.string().email(),
  donor_cpf: z.string().optional(),
  success_url: z.string().url(),
  cancel_url: z.string().url(),
});

/**
 * POST /api/campanhas/:campaignId/donate - Criar sessão de doação
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const body = await request.json();
    const data = donateSchema.parse(body);

    const supabase = supabaseServer();

    // Busca a campanha
    const { data: campaign } = await supabase
      .from('campanhas')
      .select('id, title')
      .eq('id', params.campaignId)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Cria sessão de checkout
    const session = await createCheckoutSession({
      campaignId: params.campaignId,
      campaignTitle: campaign.title,
      amount: data.amount,
      donorEmail: data.donor_email,
      donorName: data.donor_name,
      successUrl: data.success_url,
      cancelUrl: data.cancel_url,
    });

    return NextResponse.json(
      {
        checkout_url: session.url,
        session_id: session.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validação falhou',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Create donation session error:', error);
    return NextResponse.json({ error: 'Erro ao criar sessão de doação' }, { status: 500 });
  }
}
