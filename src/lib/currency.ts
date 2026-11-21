export const currency = {
  formatBRL(value: number | null | undefined): string {
    if (!value) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },

  parseBRL(value: string): number {
    // Remove currency symbol and spaces
    const cleaned = value.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  },

  /**
   * Calculate percentage of goal reached
   */
  calculateProgress(current: number, goal: number | null | undefined): number {
    if (!goal || goal === 0) return 0;
    const percentage = (current / goal) * 100;
    return Math.min(100, Math.max(0, percentage));
  },

  /**
   * Calculate percentage as string with 2 decimals
   */
  formatProgress(current: number, goal: number | null | undefined): string {
    const percentage = currency.calculateProgress(current, goal);
    return `${percentage.toFixed(0)}%`;
  },
};

export default currency;
