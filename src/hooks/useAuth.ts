'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/database';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    // Tenta obter usuário do cookie ou da API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setState({
            user: data.user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Usuário não autenticado
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Erro ao verificar autenticação',
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer login');
      }

      const data = await response.json();

      setState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      router.push('/admin');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: errorMessage,
      });
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Erro ao fazer logout',
      });
    }
  };

  return {
    ...state,
    login,
    logout,
  };
}
