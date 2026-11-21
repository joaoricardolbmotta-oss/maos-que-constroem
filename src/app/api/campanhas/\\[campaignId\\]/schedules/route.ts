import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

const scheduleSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['export', 'email', 'backup', 'report']),
  cron: z.string(), // cron expression: "0 9 * * *" = daily at 9am
  config: z.record(z.any()),
  enabled: z.boolean().optional(),
});

/**
 * GET /api/campanhas/:campaignId/schedules - Lista agendamentos
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('scheduled_tasks')
      .select('*')
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ schedules: data }, { status: 200 });
  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 });
  }
}

/**
 * POST /api/campanhas/:campaignId/schedules - Criar agendamento
 */
export async function POST(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    await requireAdmin();

    const body = await request.json();
    const data = scheduleSchema.parse(body);

    const supabase = supabaseServer();

    const { data: schedule, error } = await supabase
      .from('scheduled_tasks')
      .insert([
        {
          campaign_id: params.campaignId,
          name: data.name,
          type: data.type,
          cron: data.cron,
          config: data.config,
          enabled: data.enabled ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ schedule }, { status: 201 });
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

    console.error('Create schedule error:', error);
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 });
  }
}

/**
 * PUT /api/campanhas/:campaignId/schedules/:id
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
    const data = scheduleSchema.partial().parse(body);

    const supabase = supabaseServer();

    const { data: schedule, error } = await supabase
      .from('scheduled_tasks')
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

    return NextResponse.json({ schedule }, { status: 200 });
  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar agendamento' }, { status: 500 });
  }
}

/**
 * DELETE /api/campanhas/:campaignId/schedules/:id
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
      .from('scheduled_tasks')
      .delete()
      .eq('id', id)
      .eq('campaign_id', params.campaignId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json({ error: 'Erro ao deletar agendamento' }, { status: 500 });
  }
}
