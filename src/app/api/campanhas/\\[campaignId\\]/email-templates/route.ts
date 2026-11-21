import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const templateSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['receita', 'despesa', 'doacao', 'custom']),
  subject: z.string().min(1),
  html_template: z.string().min(1),
  variables: z.array(z.string()).optional(),
});

/**
 * GET /api/campanhas/:campaignId/email-templates - Lista templates
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ templates: data }, { status: 200 });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json({ error: 'Erro ao buscar templates' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/email-templates - Criar template
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = templateSchema.parse(body);

    const supabase = supabaseServer();

    const { data: template, error } = await supabase
      .from('email_templates')
      .insert([
        {
          campaign_id: params.campaignId,
          name: data.name,
          type: data.type,
          subject: data.subject,
          html_template: data.html_template,
          variables: data.variables || [],
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ template }, { status: 201 });
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

    console.error('Create template error:', error);
    return NextResponse.json({ error: 'Erro ao criar template' }, { status: 500 });
  }
}

/**
 * PUT /api/campanhas/:campaignId/email-templates/:id
 */
export async function PUT(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const body = await request.json();
    const data = templateSchema.partial().parse(body);

    const supabase = supabaseServer();

    const { data: template, error } = await supabase
      .from('email_templates')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('campaign_id', params.campaignId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar template' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/email-templates/:id
 */
export async function DELETE(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const supabase = supabaseServer();

    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id)
      .eq('campaign_id', params.campaignId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json({ error: 'Erro ao deletar template' }, { status: 500 });
  }
}
