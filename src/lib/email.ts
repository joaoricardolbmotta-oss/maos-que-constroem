import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.SMTP_HOST) {
    console.warn('Email not configured - skipping send');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@maosqueconstroem.com',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export function generateReceitaNotificationEmail(
  campaignTitle: string,
  amount: number,
  donorName?: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">Nova Doação Recebida!</h2>
      <p>Uma nova doação foi registrada na campanha <strong>${campaignTitle}</strong>.</p>

      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
        ${donorName ? `<p><strong>Doador:</strong> ${donorName}</p>` : ''}
      </div>

      <p>Acesse a plataforma para mais detalhes.</p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #64748b; font-size: 12px; text-align: center;">
        Mãos que Constroem - Plataforma de Transparência
      </p>
    </div>
  `;
}

export function generateDespesaNotificationEmail(campaignTitle: string, description: string, amount: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ef4444;">Nova Despesa Registrada</h2>
      <p>Uma nova despesa foi registrada na campanha <strong>${campaignTitle}</strong>.</p>

      <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Descrição:</strong> ${description}</p>
        <p><strong>Valor:</strong> R$ ${amount.toFixed(2)}</p>
      </div>

      <p>Acesse a plataforma para mais detalhes.</p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #64748b; font-size: 12px; text-align: center;">
        Mãos que Constroem - Plataforma de Transparência
      </p>
    </div>
  `;
}

export function generateDoacaoNotificationEmail(
  campaignTitle: string,
  itemName: string,
  quantity: number,
  unit?: string
) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Nova Doação de Bem Recebida!</h2>
      <p>Um novo bem foi doado para a campanha <strong>${campaignTitle}</strong>.</p>

      <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Item:</strong> ${itemName}</p>
        <p><strong>Quantidade:</strong> ${quantity} ${unit || 'unidade(s)'}</p>
      </div>

      <p>Acesse a plataforma para mais detalhes.</p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #64748b; font-size: 12px; text-align: center;">
        Mãos que Constroem - Plataforma de Transparência
      </p>
    </div>
  `;
}
