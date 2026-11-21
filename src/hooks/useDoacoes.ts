'use client';

import { useEffect, useState } from 'react';
import { DoacaoMaterial } from '@/types/database';
import { DoacaoInput } from '@/lib/validators';

interface DoacoesState {
  doacoes: DoacaoMaterial[];
  isLoading: boolean;
  error: string | null;
}

export function useDoacoes(campaignId: string) {
  const [state, setState] = useState<DoacoesState>({
    doacoes: [],
    isLoading: true,
    error: null,
  });

  const fetchDoacoes = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/campanhas/${campaignId}/doacoes`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar doações');
      }

      const data = await response.json();

      setState({
        doacoes: data.doacoes,
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

  const createDoacao = async (data: DoacaoInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/doacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar doação');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        doacoes: [result.doacao, ...prev.doacoes],
      }));

      return result.doacao;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const updateDoacao = async (id: string, data: DoacaoInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/doacoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar doação');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        doacoes: prev.doacoes.map((d) => (d.id === id ? result.doacao : d)),
      }));

      return result.doacao;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const deleteDoacao = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/doacoes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar doação');
      }

      setState((prev) => ({
        ...prev,
        doacoes: prev.doacoes.filter((d) => d.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchDoacoes();
  }, [campaignId]);

  return {
    ...state,
    createDoacao,
    updateDoacao,
    deleteDoacao,
  };
}
