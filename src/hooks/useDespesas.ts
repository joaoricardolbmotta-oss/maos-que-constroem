'use client';

import { useEffect, useState } from 'react';
import { Despesa } from '@/types/database';
import { DespesaInput } from '@/lib/validators';

interface DespesasState {
  despesas: Despesa[];
  isLoading: boolean;
  error: string | null;
}

export function useDespesas(campaignId: string) {
  const [state, setState] = useState<DespesasState>({
    despesas: [],
    isLoading: true,
    error: null,
  });

  const fetchDespesas = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/campanhas/${campaignId}/despesas`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar despesas');
      }

      const data = await response.json();

      setState({
        despesas: data.despesas,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const createDespesa = async (data: DespesaInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/despesas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar despesa');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        despesas: [result.despesa, ...prev.despesas],
      }));

      return result.despesa;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const updateDespesa = async (id: string, data: DespesaInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/despesas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar despesa');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        despesas: prev.despesas.map((d) => (d.id === id ? result.despesa : d)),
      }));

      return result.despesa;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const deleteDespesa = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/despesas/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar despesa');
      }

      setState((prev) => ({
        ...prev,
        despesas: prev.despesas.filter((d) => d.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchDespesas();
  }, [campaignId]);

  return {
    ...state,
    createDespesa,
    updateDespesa,
    deleteDespesa,
  };
}
