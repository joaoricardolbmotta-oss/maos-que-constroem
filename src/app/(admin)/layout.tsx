'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Carregando
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated || !user) {
    return null; // Middleware redireciona para login
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="font-semibold text-slate-900">Mãos que Constroem</span>
              </Link>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/admin"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/campanhas"
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Campanhas
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="text-slate-900 font-medium">{user.name}</p>
                <p className="text-slate-500 text-xs">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
