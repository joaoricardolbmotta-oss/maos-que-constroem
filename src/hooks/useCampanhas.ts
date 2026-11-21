'use client';

import { useEffect, useState } from 'react';
import { Campanha } from '@/types/database';
import { CampaignInput } from '@/lib/validators';

interface CampanhasState {
  campanhas: Campanha[];
  total: number;
  page: number;
  pages: number;
  isLoading: boolean;
  error: string | null;
}

export function useCampanhas() {
  const [state, setState] = useState<CampanhasState>({
    campanhas: [],
    total: 0,
    page: 1,
    pages: 0,
    isLoading: true,
    error: null,
  });

  const fetchCampanhas = async (status?: string, page: number = 1) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page.toString());

      const response = await fetch(`/api/campanhas?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar campanhas');
      }

      const data = await response.json();

      setState({
        campanhas: data.campanhas,
        total: data.total,
        page: data.page,
        pages: data.pages,
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

  const getCampanha = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Campanha não encontrada');
      }

      const data = await response.json();
      return data.campanha;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar campanha';
      throw new Error(errorMessage);
    }
  };

  const createCampanha = async (data: CampaignInput) => {
    try {
      const response = await fetch('/api/campanhas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar campanha');
      }

      const result = await response.json();

      // Atualiza lista localmente
      setState((prev) => ({
        ...prev,
        campanhas: [result.campanha, ...prev.campanhas],
        total: prev.total + 1,
      }));

      return result.campanha;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const updateCampanha = async (id: string, data: CampaignInput) => {
    try {
      const response = await fetch(`/api/campanhas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar campanha');
      }

      const result = await response.json();

      // Atualiza lista localmente
      setState((prev) => ({
        ...prev,
        campanhas: prev.campanhas.map((c) => (c.id === id ? result.campanha : c)),
      }));

      return result.campanha;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const deleteCampanha = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar campanha');
      }

      // Atualiza lista localmente
      setState((prev) => ({
        ...prev,
        campanhas: prev.campanhas.filter((c) => c.id !== id),
        total: prev.total - 1,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCampanhas();
  }, []);

  return {
    ...state,
    fetchCampanhas,
    getCampanha,
    createCampanha,
    updateCampanha,
    deleteCampanha,
  };
}
