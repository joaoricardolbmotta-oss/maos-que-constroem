import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { handleStripeWebhook } from '@/lib/stripe';

/**
 * POST /api/webhooks/stripe - Webhook do Stripe
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
    }

    const webhookResult = await handleStripeWebhook(body, signature);

    if (webhookResult.type === 'payment_succeeded') {
      const paymentIntent = webhookResult.data;
      const campaignId = paymentIntent.metadata?.['campaign_id'];
      const donorName = paymentIntent.metadata?.['donor_name'];

      if (campaignId) {
        const supabase = supabaseServer();

        // Cria receita automaticamente
        await supabase.from('receitas').insert([
          {
            campaign_id: campaignId,
            description: `Doação via Stripe - ${paymentIntent.id}`,
            amount: paymentIntent.amount / 100, // Converte de centavos
            source: 'stripe',
            donor_name: donorName,
            donor_cpf: donorCpf,
            receipt_number: paymentIntent.id,
            receipt_date: new Date().toISOString(),
          },
        ]);

        console.log(`Receita criada automaticamente para campanha ${campaignId}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
