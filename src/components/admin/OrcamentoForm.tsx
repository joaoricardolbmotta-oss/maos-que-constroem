'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orcamentoSchema, OrcamentoInput } from '@/lib/validators';
import { OrcamentoItem } from '@/types/database';

interface OrcamentoFormProps {
  mode: 'create' | 'edit';
  initial?: OrcamentoItem;
  onSubmit: (data: OrcamentoInput) => Promise<void>;
  onCancel: () => void;
}

export function OrcamentoForm({ mode, initial, onSubmit, onCancel }: OrcamentoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrcamentoInput>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: initial
      ? {
          category: initial.category,
          description: initial.description,
          estimated_amount: initial.estimated_amount,
          actual_amount: initial.actual_amount,
          notes: initial.notes,
        }
      : {
          category: 'transporte',
          actual_amount: 0,
        },
  });

  const handleFormSubmit = async (data: OrcamentoInput) => {
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

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Categoria *</label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        >
          <option value="transporte">Transporte</option>
          <option value="alimentacao">Alimentação</option>
          <option value="materiais">Materiais</option>
          <option value="comunicacao">Comunicação</option>
          <option value="infraestrutura">Infraestrutura</option>
          <option value="recursos-humanos">Recursos Humanos</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Descrição *</label>
        <input
          type="text"
          {...register('description')}
          placeholder="Ex: Combustível para distribuição de doações"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Estimated Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Valor Estimado (R$) *</label>
        <input
          type="number"
          step="0.01"
          {...register('estimated_amount', { valueAsNumber: true })}
          placeholder="0.00"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.estimated_amount && (
          <p className="mt-1 text-sm text-red-600">{errors.estimated_amount.message}</p>
        )}
      </div>

      {/* Actual Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Valor Real (R$)</label>
        <input
          type="number"
          step="0.01"
          {...register('actual_amount', { valueAsNumber: true })}
          placeholder="0.00"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.actual_amount && <p className="mt-1 text-sm text-red-600">{errors.actual_amount.message}</p>}
        <p className="mt-1 text-sm text-slate-500">Deixe em branco se ainda não foi gasto</p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Observações</label>
        <textarea
          {...register('notes')}
          placeholder="Notas adicionais sobre este item do orçamento..."
          rows={3}
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
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar Item' : 'Atualizar Item'}
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
