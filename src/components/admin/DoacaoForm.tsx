'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doacaoSchema, DoacaoInput } from '@/lib/validators';
import { DoacaoMaterial } from '@/types/database';

interface DoacaoFormProps {
  mode: 'create' | 'edit';
  initial?: DoacaoMaterial;
  onSubmit: (data: DoacaoInput) => Promise<void>;
  onCancel: () => void;
}

export function DoacaoForm({ mode, initial, onSubmit, onCancel }: DoacaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoacaoInput>({
    resolver: zodResolver(doacaoSchema),
    defaultValues: initial
      ? {
          item_name: initial.item_name,
          category: initial.category,
          quantity: initial.quantity,
          unit: initial.unit,
          donor_name: initial.donor_name,
          donor_cpf: initial.donor_cpf,
          received_date: initial.received_date,
        }
      : {
          category: 'alimentos',
          unit: 'unidade',
        },
  });

  const handleFormSubmit = async (data: DoacaoInput) => {
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

      {/* Item Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Item *</label>
        <input
          type="text"
          {...register('item_name')}
          placeholder="Ex: Arroz, Leite, Camisetas"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.item_name && <p className="mt-1 text-sm text-red-600">{errors.item_name.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Categoria *</label>
        <select
          {...register('category')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        >
          <option value="alimentos">Alimentos</option>
          <option value="higiene">Higiene e Limpeza</option>
          <option value="roupas">Roupas e Acessórios</option>
          <option value="brinquedos">Brinquedos</option>
          <option value="outros">Outros</option>
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade *</label>
        <input
          type="number"
          {...register('quantity', { valueAsNumber: true })}
          placeholder="Ex: 50"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
      </div>

      {/* Unit */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Unidade</label>
        <input
          type="text"
          {...register('unit')}
          placeholder="Ex: unidade, kg, caixa, litro"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
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

      {/* Received Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Data de Recebimento *</label>
        <input
          type="date"
          {...register('received_date')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          disabled={isSubmitting}
        />
        {errors.received_date && <p className="mt-1 text-sm text-red-600">{errors.received_date.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Registrar Doação' : 'Atualizar Doação'}
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
