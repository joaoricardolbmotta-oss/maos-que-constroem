import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

interface CreateCheckoutSessionOptions {
  campaignId: string;
  campaignTitle: string;
  amount: number; // em centavos
  donorEmail: string;
  donorName?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession({
  campaignId,
  campaignTitle,
  amount,
  donorEmail,
  donorName,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionOptions) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: donorEmail,
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: `Doação para ${campaignTitle}`,
            description: `Campanha: ${campaignTitle}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      campaign_id: campaignId,
      donor_name: donorName,
      donor_email: donorEmail,
    },
  });

  return session;
}

interface PaymentIntentData {
  campaignId: string;
  amount: number;
  donorEmail: string;
  donorName?: string;
  donorCpf?: string;
}

export async function createPaymentIntent({
  campaignId,
  amount,
  donorEmail,
  donorName,
  donorCpf,
}: PaymentIntentData) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured');
  }

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'brl',
    payment_method_types: ['card'],
    receipt_email: donorEmail,
    metadata: {
      campaign_id: campaignId,
      donor_name: donorName,
      donor_email: donorEmail,
      donor_cpf: donorCpf,
    },
  });

  return intent;
}

export async function handleStripeWebhook(body: string, signature: string) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook secret not configured');
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // Aqui você criaria a receita no banco
        return {
          handled: true,
          type: 'payment_succeeded',
          data: paymentIntent,
        };

      case 'charge.refunded':
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge refunded:', charge.id);
        // Aqui você marcaria a receita como refundada
        return {
          handled: true,
          type: 'charge_refunded',
          data: charge,
        };

      default:
        console.log('Unhandled event type:', event.type);
        return { handled: false };
    }
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}
