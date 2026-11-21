'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { receitaSchema, ReceitaInput } from '@/lib/validators';
import { Receita } from '@/types/database';

interface ReceitaFormProps {
  mode: 'create' | 'edit';
  initial?: Receita;
  onSubmit: (data: ReceitaInput) => Promise<void>;
  onCancel: () => void;
}

export function ReceitaForm({ mode, initial, onSubmit, onCancel }: ReceitaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceitaInput>({
    resolver: zodResolver(receitaSchema),
    defaultValues: initial
      ? {
          description: initial.description,
          amount: initial.amount,
          source: initial.source,
          donor_name: initial.donor_name,
          donor_cpf: initial.donor_cpf,
          receipt_number: initial.receipt_number,
          receipt_date: initial.receipt_date,
        }
      : {
          source: 'doador',
        },
  });

  const handleFormSubmit = async (data: ReceitaInput) => {
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
          placeholder="Ex: Doação de empresa, Venda de bolo"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
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

      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Origem *</label>
        <select
          {...register('source')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        >
          <option value="doador">Doador Individual</option>
          <option value="doador-anônimo">Doador Anônimo</option>
          <option value="comercio">Comércio/Empresa</option>
          <option value="governo">Governo/Órgão Público</option>
          <option value="instituicao">Instituição</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      {/* Donor Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Doador</label>
        <input
          type="text"
          {...register('donor_name')}
          placeholder="Ex: João Silva"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-sm text-slate-500">Será mascarado na view pública</p>
      </div>

      {/* Donor CPF */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">CPF do Doador</label>
        <input
          type="text"
          {...register('donor_cpf')}
          placeholder="000.000.000-00"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.donor_cpf && <p className="mt-1 text-sm text-red-600">{errors.donor_cpf.message}</p>}
        <p className="mt-1 text-sm text-slate-500">Será mascarado na view pública</p>
      </div>

      {/* Receipt Number */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Número do Comprovante</label>
        <input
          type="text"
          {...register('receipt_number')}
          placeholder="Ex: REC-001"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
      </div>

      {/* Receipt Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Data do Comprovante *</label>
        <input
          type="date"
          {...register('receipt_date')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.receipt_date && <p className="mt-1 text-sm text-red-600">{errors.receipt_date.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Registrar Receita' : 'Atualizar Receita'}
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
