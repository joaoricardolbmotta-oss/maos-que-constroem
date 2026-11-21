'use client';

import { useEffect, useState } from 'react';
import { OrcamentoItem } from '@/types/database';
import { OrcamentoInput } from '@/lib/validators';

interface OrcamentosState {
  orcamentos: OrcamentoItem[];
  isLoading: boolean;
  error: string | null;
}

export function useOrcamentos(campaignId: string) {
  const [state, setState] = useState<OrcamentosState>({
    orcamentos: [],
    isLoading: true,
    error: null,
  });

  const fetchOrcamentos = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/campanhas/${campaignId}/orcamento`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar orçamentos');
      }

      const data = await response.json();

      setState({
        orcamentos: data.orcamentos,
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

  const createOrcamento = async (data: OrcamentoInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/orcamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar item de orçamento');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        orcamentos: [result.orcamento, ...prev.orcamentos],
      }));

      return result.orcamento;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const updateOrcamento = async (id: string, data: OrcamentoInput) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/orcamento/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar item de orçamento');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        orcamentos: prev.orcamentos.map((o) => (o.id === id ? result.orcamento : o)),
      }));

      return result.orcamento;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const deleteOrcamento = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/orcamento/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar item de orçamento');
      }

      setState((prev) => ({
        ...prev,
        orcamentos: prev.orcamentos.filter((o) => o.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchOrcamentos();
  }, [campaignId]);

  return {
    ...state,
    createOrcamento,
    updateOrcamento,
    deleteOrcamento,
  };
}
