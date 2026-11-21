import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

/**
 * GET /api/campanhas/:campaignId/comprovantes - Lista comprovantes
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('comprovantes')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ comprovantes: data }, { status: 200 });
  } catch (error) {
    console.error('Get comprovantes error:', error);
    return NextResponse.json({ error: 'Erro ao buscar comprovantes' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/comprovantes - Upload de comprovante
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const entity_type = formData.get('entity_type') as string;
    const entity_id = formData.get('entity_id') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 });
    }

    if (!entity_type || !entity_id) {
      return NextResponse.json(
        { error: 'Tipo e ID da entidade são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();

    // Verifica se campanha existe
    const { data: campaign } = await supabase
      .from('campanhas')
      .select('id')
      .eq('id', params.campaignId)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 });
    }

    // Gera nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${params.campaignId}/${entity_type}/${entity_id}/${Date.now()}.${fileExt}`;

    // Upload para Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('comprovantes')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Cria registro no banco de dados
    const { data: comprovante, error: dbError } = await supabase
      .from('comprovantes')
      .insert([
        {
          campaign_id: params.campaignId,
          entity_type,
          entity_id,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          file_type: file.type,
          description: description || null,
        },
      ])
      .select()
      .single();

    if (dbError) {
      // Tenta deletar o arquivo se a criação do registro falhar
      await supabase.storage.from('comprovantes').remove([uploadData.path]);
      throw dbError;
    }

    return NextResponse.json({ comprovante }, { status: 201 });
  } catch (error) {
    console.error('Create comprovante error:', error);
    return NextResponse.json({ error: 'Erro ao fazer upload do comprovante' }, { status: 500 });
  }
}
