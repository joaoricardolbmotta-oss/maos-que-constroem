import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

/**
 * GET /api/campanhas/:campaignId/qrcode - Gera QR code para a campanha pública
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const supabase = supabaseServer();

    // Busca a campanha
    const { data: campaign } = await supabase
      .from('campanhas')
      .select('public_slug')
      .eq('id', params.campaignId)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Monta a URL da campanha pública
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://maosqueconstroem.com';
    const campaignUrl = `${baseUrl}/campanha/${campaign.public_slug}`;

    // Usa a API QR Server (serviço gratuito)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(campaignUrl)}`;

    // Redireciona para a imagem QR code
    return NextResponse.redirect(qrApiUrl);
  } catch (error) {
    console.error('Get qrcode error:', error);
    return NextResponse.json({ error: 'Erro ao gerar QR code' }, { status: 500 });
  }
}
