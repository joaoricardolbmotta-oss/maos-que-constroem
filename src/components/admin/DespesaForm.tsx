'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { despesaSchema, DespesaInput } from '@/lib/validators';
import { Despesa } from '@/types/database';

interface DespesaFormProps {
  mode: 'create' | 'edit';
  initial?: Despesa;
  onSubmit: (data: DespesaInput) => Promise<void>;
  onCancel: () => void;
}

export function DespesaForm({ mode, initial, onSubmit, onCancel }: DespesaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DespesaInput>({
    resolver: zodResolver(despesaSchema),
    defaultValues: initial
      ? {
          description: initial.description,
          category: initial.category,
          amount: initial.amount,
          expense_date: initial.expense_date,
          vendor_name: initial.vendor_name,
        }
      : {
          category: 'alimentacao',
        },
  });

  const handleFormSubmit = async (data: DespesaInput) => {
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

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Descrição *</label>
        <input
          type="text"
          {...register('description')}
          placeholder="Ex: Alimentos para distribuição, Combustível"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Categoria *</label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        >
          <option value="alimentacao">Alimentação</option>
          <option value="transporte">Transporte</option>
          <option value="material">Material</option>
          <option value="infraestrutura">Infraestrutura</option>
          <option value="recursos-humanos">Recursos Humanos</option>
          <option value="admin">Administrativo</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Valor (R$) *</label>
        <input
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          placeholder="0.00"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      {/* Expense Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Data da Despesa *</label>
        <input
          type="date"
          {...register('expense_date')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.expense_date && <p className="mt-1 text-sm text-red-600">{errors.expense_date.message}</p>}
      </div>

      {/* Vendor Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Fornecedor/Vendedor</label>
        <input
          type="text"
          {...register('vendor_name')}
          placeholder="Ex: Mercado ABC, Empresa XYZ"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-sm text-slate-500">Será mascarado na view pública</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Registrar Despesa' : 'Atualizar Despesa'}
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
