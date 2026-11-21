/**
 * i18n - Internationalization
 * Fase 38: Multilingual Support
 */

import { headers } from 'next/headers';

export type Language = 'pt-BR' | 'en' | 'es';

export const LANGUAGES: Record<Language, string> = {
  'pt-BR': 'Português (Brasil)',
  en: 'English',
  es: 'Español',
};

export const translations = {
  'pt-BR': {
    // Geral
    app_name: 'Mãos que Constroem',
    welcome: 'Bem-vindo',
    logout: 'Sair',
    settings: 'Configurações',
    language: 'Idioma',

    // Campanhas
    campaigns: 'Campanhas',
    new_campaign: 'Nova Campanha',
    campaign_title: 'Título',
    campaign_description: 'Descrição',
    campaign_goal: 'Meta',
    campaign_status: 'Status',

    // Financeiro
    income: 'Receitas',
    expenses: 'Despesas',
    donations: 'Doações',
    budget: 'Orçamento',
    total: 'Total',
    balance: 'Saldo',

    // Ações
    create: 'Criar',
    edit: 'Editar',
    delete: 'Deletar',
    save: 'Salvar',
    cancel: 'Cancelar',

    // Mensagens
    success: 'Operação realizada com sucesso',
    error: 'Erro ao processar',
    loading: 'Carregando...',
  },
  en: {
    // General
    app_name: 'Hands That Build',
    welcome: 'Welcome',
    logout: 'Sign Out',
    settings: 'Settings',
    language: 'Language',

    // Campaigns
    campaigns: 'Campaigns',
    new_campaign: 'New Campaign',
    campaign_title: 'Title',
    campaign_description: 'Description',
    campaign_goal: 'Goal',
    campaign_status: 'Status',

    // Financial
    income: 'Income',
    expenses: 'Expenses',
    donations: 'Donations',
    budget: 'Budget',
    total: 'Total',
    balance: 'Balance',

    // Actions
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',

    // Messages
    success: 'Operation completed successfully',
    error: 'Error processing request',
    loading: 'Loading...',
  },
  es: {
    // General
    app_name: 'Manos que Construyen',
    welcome: 'Bienvenido',
    logout: 'Cerrar sesión',
    settings: 'Configuración',
    language: 'Idioma',

    // Campaigns
    campaigns: 'Campañas',
    new_campaign: 'Nueva Campaña',
    campaign_title: 'Título',
    campaign_description: 'Descripción',
    campaign_goal: 'Meta',
    campaign_status: 'Estado',

    // Financial
    income: 'Ingresos',
    expenses: 'Gastos',
    donations: 'Donaciones',
    budget: 'Presupuesto',
    total: 'Total',
    balance: 'Saldo',

    // Actions
    create: 'Crear',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',

    // Messages
    success: 'Operación realizada exitosamente',
    error: 'Error al procesar solicitud',
    loading: 'Cargando...',
  },
};

export function getLanguageFromHeaders(): Language {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || 'pt-BR';

  if (acceptLanguage.includes('pt')) return 'pt-BR';
  if (acceptLanguage.includes('es')) return 'es';
  if (acceptLanguage.includes('en')) return 'en';

  return 'pt-BR';
}

export function t(key: string, lang: Language = 'pt-BR'): string {
  const trans = translations[lang] as Record<string, string>;
  return trans[key] || key;
}

export function formatCurrency(amount: number, lang: Language = 'pt-BR'): string {
  if (lang === 'pt-BR') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  }
  if (lang === 'es') {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date, lang: Language = 'pt-BR'): string {
  return new Intl.DateTimeFormat(lang === 'pt-BR' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US').format(date);
}
