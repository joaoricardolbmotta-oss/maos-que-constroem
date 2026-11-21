import { z } from 'zod';

export const CPFRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const SlugRegex = /^[a-z0-9-]+$/;

// Auth validators
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Campaign validators
export const campaignSchema = z
  .object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(180, 'Título muito longo'),
    description: z.string().max(4000, 'Descrição muito longa').nullable().optional(),
    institution: z.string().default('Instituto Joanna de Ângelis'),
    public_slug: z
      .string()
      .regex(SlugRegex, 'Slug deve conter apenas letras minúsculas, números e hífens')
      .min(3, 'Slug deve ter no mínimo 3 caracteres')
      .max(120, 'Slug muito longo'),
    date_mode: z.enum(['single', 'period', 'none']).default('single'),
    action_date: z.string().date().nullable().optional(),
    end_date: z.string().date().nullable().optional(),
    fundraising_goal: z.number().min(0, 'Meta deve ser maior que 0').nullable().optional(),
    status: z.enum(['draft', 'planned', 'active', 'finished']).default('draft'),
    estimated_audience: z.number().min(0).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.date_mode !== 'none' && !data.action_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['action_date'],
        message: 'Data é obrigatória para este tipo de campanha',
      });
    }

    if (data.date_mode === 'period') {
      if (!data.end_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['end_date'],
          message: 'Data de fim é obrigatória para campanhas com período',
        });
      }

      if (data.action_date && data.end_date && new Date(data.action_date) >= new Date(data.end_date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['end_date'],
          message: 'Data de fim deve ser após a data de início',
        });
      }
    }
  });

export type CampaignInput = z.infer<typeof campaignSchema>;

// Receita validators
export const receitaSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória').max(500),
  amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  source: z.string().min(1, 'Origem obrigatória'),
  donor_name: z.string().optional().nullable(),
  donor_cpf: z.string().regex(CPFRegex, 'CPF inválido (formato: XXX.XXX.XXX-XX)').optional().nullable(),
  receipt_number: z.string().optional().nullable(),
  receipt_date: z.string().date('Data inválida'),
});

export type ReceitaInput = z.infer<typeof receitaSchema>;

// Despesa validators
export const despesaSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória').max(500),
  category: z.string().min(1, 'Categoria obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que 0'),
  expense_date: z.string().date('Data inválida'),
  vendor_name: z.string().optional().nullable(),
});

export type DespesaInput = z.infer<typeof despesaSchema>;

// Doacao Material validators
export const doacaoSchema = z.object({
  item_name: z.string().min(1, 'Nome do item obrigatório').max(200),
  category: z.enum(['alimentos', 'higiene', 'roupas', 'brinquedos', 'outros']),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  unit: z.string().optional().nullable(),
  donor_name: z.string().optional().nullable(),
  donor_cpf: z.string().regex(CPFRegex, 'CPF inválido').optional().nullable(),
  received_date: z.string().date('Data inválida'),
});

export type DoacaoInput = z.infer<typeof doacaoSchema>;

// Orcamento Item validators
export const orcamentoItemSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(200),
  category: z.string().min(1, 'Categoria obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  unit_value: z.number().min(0.01, 'Valor unitário deve ser maior que 0'),
});

export type OrcamentoItemInput = z.infer<typeof orcamentoItemSchema>;
