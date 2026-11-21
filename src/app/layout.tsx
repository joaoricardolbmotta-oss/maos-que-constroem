import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mãos que Constroem | Transparência e Prestação de Contas',
  description: 'Plataforma de transparência e prestação de contas para campanhas de arrecadação',
  keywords: ['transparência', 'prestação de contas', 'arrecadação', 'solidariedade'],
  authors: [{ name: 'Instituto Joanna de Ângelis' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
