'use client';

import { useEffect, useState } from 'react';

interface Member {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}

interface MembersState {
  members: Member[];
  isLoading: boolean;
  error: string | null;
}

export function useMembers(campaignId: string) {
  const [state, setState] = useState<MembersState>({
    members: [],
    isLoading: true,
    error: null,
  });

  const fetchMembers = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/campanhas/${campaignId}/members`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar membros');
      }

      const data = await response.json();

      setState({
        members: data.members,
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

  const addMember = async (email: string, role: 'owner' | 'editor' | 'viewer') => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar membro');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        members: [result.member, ...prev.members],
      }));

      return result.member;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const updateMember = async (id: string, role: 'owner' | 'editor' | 'viewer') => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar membro');
      }

      const result = await response.json();

      setState((prev) => ({
        ...prev,
        members: prev.members.map((m) => (m.id === id ? result.member : m)),
      }));

      return result.member;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  const removeMember = async (id: string) => {
    try {
      const response = await fetch(`/api/campanhas/${campaignId}/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover membro');
      }

      setState((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.id !== id),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [campaignId]);

  return {
    ...state,
    addMember,
    updateMember,
    removeMember,
  };
}
