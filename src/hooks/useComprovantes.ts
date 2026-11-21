'use client';

import { useEffect, useState } from 'react';
import { Comprovante } from '@/types/database';

interface ComprovanteState {
  comprovantes: Comprovante[];
  isLoading: boolean;
  error: string | null;
}

export function useComprovantes(campaignId: string) {
  const [state, setState] = useState<ComprovanteState>({
    comprovantes: [],
    isLoading: true,
    error: null,
  });

  const fetchComprovantes = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/campanhas/${campaignId}/comprovantes`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar comprovantes');
      }

      const data = await response.json();

      setState({
        comprovantes: data.comprovantes,
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

  const uploadComprovante = async (
    file: File,
    entity_type: string,
    entity_id: string,
    description?: string
  ) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entity_type', entity_type);
      formData.append('entity_id', entity_id);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch(`/api/campanhas/${campaignId}/comprovantes`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload do comprovante');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        comprovantes: [result.comprovante, ...prev.comprovantes],
      }));

      return result.comprovante;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const deleteComprovante = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/comprovantes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar comprovante');
      }

      setState((prev) => ({
        ...prev,
        comprovantes: prev.comprovantes.filter((c) => c.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const getDownloadUrl = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/comprovantes/${id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao obter URL de download');
      }

      const data = await response.json();
      return data.downloadUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchComprovantes();
  }, [campaignId]);

  return {
    ...state,
    uploadComprovante,
    deleteComprovante,
    getDownloadUrl,
  };
}
