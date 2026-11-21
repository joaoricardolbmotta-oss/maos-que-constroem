'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { campaignSchema, CampaignInput } from '@/lib/validators';
import { Campanha } from '@/types/database';
import { dateUtils } from '@/lib/date';

interface CampanhaFormProps {
  mode: 'create' | 'edit';
  initial?: Campanha;
  onSubmit: (data: CampaignInput) => Promise<void>;
  onCancel: () => void;
}

export function CampanhaForm({ mode, initial, onSubmit, onCancel }: CampanhaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          institution: initial.institution,
          public_slug: initial.public_slug,
          date_mode: initial.date_mode,
          action_date: initial.action_date,
          end_date: initial.end_date,
          fundraising_goal: initial.fundraising_goal ?? undefined,
          status: initial.status,
          estimated_audience: initial.estimated_audience ?? undefined,
        }
      : {
          institution: 'Instituto Joanna de Ângelis',
          date_mode: 'single',
          status: 'draft',
        },
  });

  const dateMode = watch('date_mode');

  const handleFormSubmit = async (data: CampaignInput) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      {/* Error */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{submitError}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Projeto *</label>
        <input
          type="text"
          {...register('title')}
          placeholder="Ex: Ação 01, Natal Solidário 2024"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Propósito (Descrição)</label>
        <textarea
          {...register('description')}
          placeholder="Descreva o objetivo da campanha..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Institution */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Instituição Responsável</label>
        <input
          type="text"
          {...register('institution')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Identificador do Link Público *</label>
        <input
          type="text"
          {...register('public_slug')}
          placeholder="Ex: acao-01, natal-solidario-2024"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.public_slug && <p className="mt-1 text-sm text-red-600">{errors.public_slug.message}</p>}
      </div>

      {/* Date Mode */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Data *</label>
        <select
          {...register('date_mode')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        >
          <option value="single">Data única</option>
          <option value="period">Período (início e fim)</option>
          <option value="none">Sem data definida</option>
        </select>
      </div>

      {/* Action Date */}
      {dateMode !== 'none' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Data do Projeto *</label>
          <input
            type="date"
            {...register('action_date')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            disabled={isSubmitting}
          />
          {errors.action_date && <p className="mt-1 text-sm text-red-600">{errors.action_date.message}</p>}
        </div>
      )}

      {/* End Date */}
      {dateMode === 'period' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Data de Término *</label>
          <input
            type="date"
            {...register('end_date')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            disabled={isSubmitting}
          />
          {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>}
        </div>
      )}

      {/* Fundraising Goal */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Meta de Arrecadação (R$)</label>
        <input
          type="number"
          step="0.01"
          {...register('fundraising_goal', { valueAsNumber: true })}
          placeholder="Ex: 5000.00"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-sm text-slate-500">Deixe em branco para usar a soma do orçamento</p>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Situação *</label>
        <select
          {...register('status')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        >
          <option value="draft">Rascunho (não aparece no portal público)</option>
          <option value="planned">Planejado</option>
          <option value="active">Em andamento</option>
          <option value="finished">Encerrado</option>
        </select>
      </div>

      {/* Estimated Audience */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Público Estimado</label>
        <input
          type="number"
          {...register('estimated_audience', { valueAsNumber: true })}
          placeholder="Ex: 100"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar Campanha' : 'Atualizar Campanha'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 disabled:cursor-not-allowed transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
