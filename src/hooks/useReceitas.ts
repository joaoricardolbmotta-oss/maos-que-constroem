'use client';

import { useEffect, useState } from 'react';
import { Receita } from '@/types/database';
import { ReceitaInput } from '@/lib/validators';

interface ReceitasState {
  receitas: Receita[];
  isLoading: boolean;
  error: string | null;
}

export function useReceitas(campaignId: string) {
  const [state, setState] = useState<ReceitasState>({
    receitas: [],
    isLoading: true,
    error: null,
  });

  const fetchReceitas = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/campanhas/${campaignId}/receitas`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar receitas');
      }

      const data = await response.json();

      setState({
        receitas: data.receitas,
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

  const createReceita = async (data: ReceitaInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/receitas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar receita');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        receitas: [result.receita, ...prev.receitas],
      }));

      return result.receita;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const updateReceita = async (id: string, data: ReceitaInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/receitas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar receita');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        receitas: prev.receitas.map((r) => (r.id === id ? result.receita : r)),
      }));

      return result.receita;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const deleteReceita = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/receitas/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar receita');
      }

      setState((prev) => ({
        ...prev,
        receitas: prev.receitas.filter((r) => r.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, [campaignId]);

  return {
    ...state,
    createReceita,
    updateReceita,
    deleteReceita,
  };
}
