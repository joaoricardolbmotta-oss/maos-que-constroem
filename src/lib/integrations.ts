/**
 * Integrações externas da plataforma
 */

export interface GoogleSheetsConfig {
  spreadsheet_id: string;
  sheets: {
    receitas: string;
    despesas: string;
    doacoes: string;
  };
  api_key: string;
}

export interface StripeConfig {
  public_key: string;
  secret_key: string;
  webhook_secret: string;
}

export interface SlackConfig {
  webhook_url: string;
  channel: string;
}

// Google Sheets Integration
export async function appendToGoogleSheet(
  config: GoogleSheetsConfig,
  sheetName: string,
  values: string[][]
) {
  if (!config.api_key || !config.spreadsheet_id) {
    console.warn('Google Sheets config not provided');
    return;
  }

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheet_id}/values/${sheetName}!A:Z:append?valueInputOption=USER_ENTERED&key=${config.api_key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to append to Google Sheet');
    }

    return await response.json();
  } catch (error) {
    console.error('Google Sheets error:', error);
    throw error;
  }
}

// Slack Integration
export async function sendSlackNotification(
  config: SlackConfig,
  message: {
    text?: string;
    blocks?: Record<string, any>[];
  }
) {
  if (!config.webhook_url) {
    console.warn('Slack config not provided');
    return;
  }

  try {
    const response = await fetch(config.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send Slack message');
    }

    return await response.json();
  } catch (error) {
    console.error('Slack error:', error);
    throw error;
  }
}

// Discord Integration (similar to Slack)
export async function sendDiscordNotification(
  webhookUrl: string,
  message: {
    content?: string;
    embeds?: Record<string, any>[];
  }
) {
  if (!webhookUrl) {
    console.warn('Discord webhook not provided');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to send Discord message');
    }

    return await response.json();
  } catch (error) {
    console.error('Discord error:', error);
    throw error;
  }
}

// Stripe Webhook Verification
export function verifyStripeSignature(
  signature: string,
  body: string,
  webhookSecret: string
): boolean {
  if (!webhookSecret) {
    console.warn('Stripe webhook secret not configured');
    return false;
  }

  try {
    const crypto = require('crypto');
    const [timestamp, hash] = signature.split(',').map((part) => part.split('=')[1]);

    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${body}`)
      .digest('hex');

    return computedSignature === hash;
  } catch (error) {
    console.error('Stripe signature verification error:', error);
    return false;
  }
}

// Google Analytics Integration
export function trackEvent(
  measurementId: string,
  clientId: string,
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) {
  if (!measurementId || !clientId) {
    console.warn('Google Analytics config incomplete');
    return;
  }

  return fetch('https://www.google-analytics.com/mp/collect', {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      events: [
        {
          name: eventName,
          params: eventParams,
        },
      ],
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch((error) => {
    console.error('Google Analytics error:', error);
  });
}

// Generic Webhook Dispatcher
export async function dispatchWebhook(
  webhookUrl: string,
  event: string,
  payload: Record<string, any>,
  secret?: string
) {
  try {
    const body = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data: payload,
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mãos-que-Constroem/1.0',
    };

    // Add signature if secret provided
    if (secret) {
      const crypto = require('crypto');
      const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
      headers['X-Signature'] = signature;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body,
      headers,
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Webhook dispatch error:', error);
    throw error;
  }
}
