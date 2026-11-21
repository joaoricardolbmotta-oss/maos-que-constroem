/**
 * Privacy & masking utilities for public data
 * Ensures sensitive personal data is hidden in public views
 */

export const privacy = {
  /**
   * Masks CPF to show only last 3 digits
   * Example: 123.456.789-10 → ***.***.***.10
   */
  maskCPF(cpf: string | null | undefined): string {
    if (!cpf) return '***.***.***-**';

    // Remove formatting if any
    const clean = cpf.replace(/\D/g, '');

    if (clean.length !== 11) return '***.***.***-**';

    return `***.***.***.${clean.slice(-2)}`;
  },

  /**
   * Abbreviates name to first name + last initial
   * Example: João Ricardo Silva → João S.
   */
  maskName(name: string | null | undefined): string {
    if (!name) return 'Anônimo';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) return parts[0];

    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  },

  /**
   * Masks donor name and CPF in public data
   */
  maskReceita(receita: any) {
    return {
      ...receita,
      donor_name: privacy.maskName(receita.donor_name),
      donor_cpf: privacy.maskCPF(receita.donor_cpf),
    };
  },

  /**
   * Masks vendor name in public data
   */
  maskDespesa(despesa: any) {
    return {
      ...despesa,
      vendor_name: despesa.vendor_name ? privacy.maskName(despesa.vendor_name) : null,
    };
  },

  /**
   * Masks doacao data in public view
   */
  maskDoacao(doacao: any) {
    return {
      ...doacao,
      donor_name: privacy.maskName(doacao.donor_name),
      donor_cpf: privacy.maskCPF(doacao.donor_cpf),
    };
  },

  /**
   * Checks if content appears to have personal data
   * This is a heuristic - for images, need manual review or AI analysis
   */
  mightContainPersonalData(text: string): boolean {
    // Check for CPF patterns
    if (/\d{3}\.\d{3}\.\d{3}-\d{2}/.test(text)) return true;

    // Check for phone patterns
    if (/\(\d{2}\)\s*\d{4,5}-\d{4}/.test(text)) return true;

    // Check for email patterns
    if (/@/.test(text)) return true;

    // Check for ID patterns
    if (/\b(RG|ID|PASSPORT|PASSAPORTE)[\s:]*\d+/i.test(text)) return true;

    return false;
  },

  /**
   * URL for masked image (blur, crop, etc)
   * In a real implementation, this would call an image processing service
   */
  getMaskedImageUrl(originalUrl: string): string {
    // For now, return original
    // TODO: Implement image masking (blur faces, crop sensitive areas)
    return originalUrl;
  },

  /**
   * Is this a view context where data should be masked?
   */
  shouldMaskData(isPublicView: boolean): boolean {
    return isPublicView;
  },
};

export default privacy;
