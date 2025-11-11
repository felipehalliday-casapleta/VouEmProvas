import { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser } from '@shared/schema';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from './queryClient';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ['/api', 'auth', 'me'],
    retry: false,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Authentication failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api', 'auth', 'me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api', 'auth', 'me'], null);
      queryClient.clear();
    },
  });

  const login = async (idToken: string) => {
    await loginMutation.mutateAsync(idToken);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
