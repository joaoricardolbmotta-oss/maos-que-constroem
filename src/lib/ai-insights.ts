/**
 * AI Insights with OpenAI
 * Fase 36: AI-Powered Analytics
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CampaignAnalysis {
  summary: string;
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
  opportunityScore: number;
}

export async function analyzeCampaign(campaignData: {
  title: string;
  description: string;
  totalReceitas: number;
  totalDespesas: number;
  donorCount: number;
  categoryBreakdown: Record<string, number>;
  timeSeriesData: Array<{ date: string; amount: number }>;
}): Promise<CampaignAnalysis> {
  const prompt = `
Analise essa campanha de arrecadação e forneça insights:

Campanha: ${campaignData.title}
Descrição: ${campaignData.description}
Total Arrecadado: R$ ${campaignData.totalReceitas}
Total Gasto: R$ ${campaignData.totalDespesas}
Doadores: ${campaignData.donorCount}
Despesas por Categoria: ${JSON.stringify(campaignData.categoryBreakdown)}

Forneça em JSON:
{
  "summary": "resumo executivo (2-3 frases)",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recomendação 1", "recomendação 2"],
  "riskFactors": ["risco 1", "risco 2"],
  "opportunityScore": número de 1-10
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '{}';
  return JSON.parse(content);
}

export async function generateCampaignSummary(campaignData: any): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Resuma em 1 parágrafo essa campanha: ${JSON.stringify(campaignData)}`,
      },
    ],
  });

  return response.choices[0].message.content || '';
}

export async function predictDonorBehavior(donorHistory: any[]): Promise<{
  prediction: string;
  confidence: number;
  nextExpectedDonation: Date;
}> {
  const prompt = `Baseado no histórico de doações: ${JSON.stringify(donorHistory)}

Prever:
1. Será doador recorrente? (sim/não)
2. Confiança (0-100%)
3. Data provável do próximo aporte

Responda em JSON com chaves: prediction, confidence, nextExpectedDonation`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.choices[0].message.content || '{}';
  return JSON.parse(content);
}

export async function detectAnomalies(transactions: any[]): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Detecte anomalias nessas transações: ${JSON.stringify(transactions.slice(0, 50))}

      Retorne array JSON de strings descrevendo anomalias encontradas.`,
      },
    ],
  });

  const content = response.choices[0].message.content || '[]';
  return JSON.parse(content);
}
