/**
 * White Label & Custom Branding
 * Fase 39: White Label Configuration
 */

export interface WhiteLabelConfig {
  id: string;
  domain: string;
  companyName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  customCSS: string;
  emailTemplate: string;
  supportEmail: string;
  supportPhone: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  customPages: Record<string, string>;
  features: {
    enableStripe: boolean;
    enableAnalytics: boolean;
    enableApi: boolean;
    enableWebhooks: boolean;
    enableWhiteLabel: boolean;
  };
}

const DEFAULT_CONFIG: WhiteLabelConfig = {
  id: 'default',
  domain: 'maosqueconstroem.com',
  companyName: 'Mãos que Constroem',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  font: 'Inter, sans-serif',
  customCSS: '',
  emailTemplate: 'default',
  supportEmail: 'suporte@maosqueconstroem.com',
  supportPhone: '+55 11 1234-5678',
  privacyPolicyUrl: 'https://maosqueconstroem.com/privacy',
  termsOfServiceUrl: 'https://maosqueconstroem.com/terms',
  customPages: {},
  features: {
    enableStripe: true,
    enableAnalytics: true,
    enableApi: true,
    enableWebhooks: true,
    enableWhiteLabel: false,
  },
};

export async function getWhiteLabelConfig(domain: string): Promise<WhiteLabelConfig> {
  // Buscar em cache primeiro
  const cached = await getCachedConfig(domain);
  if (cached) return cached;

  // Buscar do banco de dados
  try {
    // const { data } = await supabaseServer()
    //   .from('white_label_configs')
    //   .select('*')
    //   .eq('domain', domain)
    //   .single();
    // if (data) return data;
  } catch (error) {
    console.error('White label config error:', error);
  }

  return DEFAULT_CONFIG;
}

export async function updateWhiteLabelConfig(
  domain: string,
  config: Partial<WhiteLabelConfig>
): Promise<WhiteLabelConfig> {
  // Validar cores
  if (config.primaryColor && !isValidColor(config.primaryColor)) {
    throw new Error('Invalid primary color');
  }

  // Atualizar em banco de dados
  // const { data } = await supabaseServer()
  //   .from('white_label_configs')
  //   .update(config)
  //   .eq('domain', domain)
  //   .select()
  //   .single();

  // Invalidar cache
  await invalidateConfigCache(domain);

  return config as WhiteLabelConfig;
}

function isValidColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color) || /^rgb\([0-9, ]+\)$/.test(color);
}

async function getCachedConfig(domain: string): Promise<WhiteLabelConfig | null> {
  // Implementar com Redis se necessário
  return null;
}

async function invalidateConfigCache(domain: string): Promise<void> {
  // Limpar cache de configuração
}

export function applyWhiteLabelStyles(config: WhiteLabelConfig): string {
  return `
    :root {
      --color-primary: ${config.primaryColor};
      --color-secondary: ${config.secondaryColor};
      --font-family: ${config.font};
    }

    ${config.customCSS}
  `;
}

export function getWhiteLabelTheme(config: WhiteLabelConfig) {
  return {
    colors: {
      primary: config.primaryColor,
      secondary: config.secondaryColor,
    },
    fonts: {
      body: config.font,
      heading: config.font,
    },
    logo: config.logo,
    favicon: config.favicon,
    companyName: config.companyName,
  };
}
