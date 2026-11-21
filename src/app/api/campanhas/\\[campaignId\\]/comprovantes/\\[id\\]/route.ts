import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/campanhas/:campaignId/comprovantes/:id - Download URL do comprovante
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('comprovantes')
      .select('*')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Comprovante não encontrado' }, { status: 404 });
    }

    // Gera URL de download assinada (válida por 1 hora)
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('comprovantes')
      .createSignedUrl(data.file_path, 3600);

    if (urlError) {
      throw urlError;
    }

    return NextResponse.json(
      { comprovante: data, downloadUrl: signedUrl.signedUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get comprovante error:', error);
    return NextResponse.json({ error: 'Erro ao buscar comprovante' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/comprovantes/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { campaignId: string; id: string } }
) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    // Busca o comprovante para obter o caminho do arquivo
    const { data: comprovante, error: fetchError } = await supabase
      .from('comprovantes')
      .select('*')
      .eq('id', params.id)
      .eq('campaign_id', params.campaignId)
      .single();

    if (fetchError || !comprovante) {
      return NextResponse.json({ error: 'Comprovante não encontrado' }, { status: 404 });
    }

    // Deleta o arquivo do storage
    const { error: storageError } = await supabase.storage
      .from('comprovantes')
      .remove([comprovante.file_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continua mesmo se não conseguir deletar o arquivo
    }

    // Deleta o registro do banco de dados
    const { error: dbError } = await supabase
      .from('comprovantes')
      .delete()
      .eq('id', params.id);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    console.error('Delete comprovante error:', error);
    return NextResponse.json({ error: 'Erro ao deletar comprovante' }, { status: 500 });
  }
}
