export const dateUtils = {
  /**
   * Format date to pt-BR format (DD/MM/YYYY)
   */
  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date + 'T12:00:00') : date;

    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  },

  /**
   * Format date with time
   */
  formatDateTime(date: string | Date | null | undefined): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Format campaign date range based on date_mode
   */
  formatCampaignDate(
    dateMode: 'single' | 'period' | 'none',
    actionDate: string | null | undefined,
    endDate: string | null | undefined
  ): string {
    if (dateMode === 'none' || !actionDate) {
      return 'Data a definir';
    }

    if (dateMode === 'period' && endDate) {
      return `${dateUtils.formatDate(actionDate)} a ${dateUtils.formatDate(endDate)}`;
    }

    return dateUtils.formatDate(actionDate);
  },

  /**
   * Get campaign status label in Portuguese
   */
  getCampaignStatusLabel(status: 'draft' | 'planned' | 'active' | 'finished'): string {
    const labels = {
      draft: 'Rascunho (fora do portal público)',
      planned: 'Planejado',
      active: 'Em andamento',
      finished: 'Encerrado',
    };

    return labels[status] || status;
  },

  /**
   * Get campaign date mode label in Portuguese
   */
  getDateModeLabel(mode: 'single' | 'period' | 'none'): string {
    const labels = {
      single: 'Data única',
      period: 'Período (início e fim)',
      none: 'Sem data definida',
    };

    return labels[mode] || mode;
  },

  /**
   * Get material category label in Portuguese
   */
  getMaterialCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      alimentos: 'Alimentos',
      higiene: 'Higiene e Limpeza',
      roupas: 'Roupas e Acessórios',
      brinquedos: 'Brinquedos',
      outros: 'Outros',
    };

    return labels[category] || category;
  },
};

export default dateUtils;
