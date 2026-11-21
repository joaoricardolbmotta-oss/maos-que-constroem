import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

/**
 * GET /api/campanhas/:campaignId/audit-logs - Lista logs de auditoria
 */
export async function GET(request: NextRequest, { params }: { params: { campaignId: string } }) {
  try {
    const user = await requireAuth();

    const supabase = supabaseServer();

    // Paginação
    const limit = 50;
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0');
    const action = request.nextUrl.searchParams.get('action');

    let query = supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      .eq('campaign_id', params.campaignId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) {
      query = query.eq('action', action);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        logs: data,
        pagination: {
          limit,
          offset,
          total: count,
          pages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json({ error: 'Erro ao buscar logs' }, { status: 500 });
  }
}

/**
 * Função helper para registrar ações
 */
export async function logAction(
  campaignId: string,
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: Record<string, any>
) {
  try {
    const supabase = supabaseServer();

    await supabase.from('audit_log').insert([
      {
        campaign_id: campaignId,
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || {},
        ip_address: null, // Adicionar de request headers se necessário
        user_agent: null, // Adicionar de request headers se necessário
      },
    ]);
  } catch (error) {
    console.error('Log action error:', error);
    // Não lance erro aqui para não interromper a operação principal
  }
}

/**
 * Funções de auditoria específicas
 */
export async function auditCampaignCreated(campaignId: string, userId: string, data: any) {
  await logAction(campaignId, userId, 'CREATE', 'campanha', campaignId, {
    title: data.title,
    status: data.status,
  });
}

export async function auditReceitaCreated(
  campaignId: string,
  userId: string,
  receitaId: string,
  data: any
) {
  await logAction(campaignId, userId, 'CREATE', 'receita', receitaId, {
    amount: data.amount,
    source: data.source,
  });
}

export async function auditDespesaCreated(
  campaignId: string,
  userId: string,
  despesaId: string,
  data: any
) {
  await logAction(campaignId, userId, 'CREATE', 'despesa', despesaId, {
    amount: data.amount,
    category: data.category,
  });
}

export async function auditDoacaoCreated(
  campaignId: string,
  userId: string,
  doacaoId: string,
  data: any
) {
  await logAction(campaignId, userId, 'CREATE', 'doacao', doacaoId, {
    item_name: data.item_name,
    quantity: data.quantity,
  });
}

export async function auditComprovantesUpload(
  campaignId: string,
  userId: string,
  comprovantesId: string,
  fileName: string
) {
  await logAction(campaignId, userId, 'UPLOAD', 'comprovante', comprovantesId, {
    file_name: fileName,
  });
}

export async function auditMemberAdded(
  campaignId: string,
  userId: string,
  memberId: string,
  email: string,
  role: string
) {
  await logAction(campaignId, userId, 'ADD_MEMBER', 'member', memberId, {
    email,
    role,
  });
}

export async function auditMemberRemoved(
  campaignId: string,
  userId: string,
  memberId: string,
  email: string
) {
  await logAction(campaignId, userId, 'REMOVE_MEMBER', 'member', memberId, {
    email,
  });
}

export async function auditExport(
  campaignId: string,
  userId: string,
  format: string,
  recordCount: number
) {
  await logAction(campaignId, userId, 'EXPORT', 'report', campaignId, {
    format,
    record_count: recordCount,
  });
}
