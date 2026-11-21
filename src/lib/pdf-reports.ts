/**
 * PDF Report Generation
 * Fase 30: PDF Reports
 */

import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface ReportOptions {
  campaignTitle: string;
  campaignDescription: string;
  reportDate: Date;
  totalReceitas: number;
  totalDespesas: number;
  totalDoacoes: number;
  donorCount: number;
  categoryBreakdown: Record<string, number>;
  topDonors: Array<{ name: string; amount: number }>;
  recentTransactions: Array<{
    type: 'receita' | 'despesa' | 'doacao';
    description: string;
    amount: number;
    date: Date;
  }>;
}

export function generatePDFReport(options: ReportOptions): Readable {
  const doc = new PDFDocument();

  // Cabeçalho
  doc.fontSize(24).text('Relatório de Campanha', { align: 'center' });
  doc.fontSize(12).text(`${options.campaignTitle}`, { align: 'center' });
  doc.fontSize(10).text(`Gerado em ${options.reportDate.toLocaleDateString('pt-BR')}`, {
    align: 'center',
  });
  doc.moveDown();

  // Resumo financeiro
  doc.fontSize(14).text('Resumo Financeiro');
  doc.fontSize(10);
  doc.text(`Total de Receitas: R$ ${options.totalReceitas.toFixed(2)}`);
  doc.text(`Total de Despesas: R$ ${options.totalDespesas.toFixed(2)}`);
  doc.text(`Total de Doações: R$ ${options.totalDoacoes.toFixed(2)}`);
  doc.text(`Saldo: R$ ${(options.totalReceitas - options.totalDespesas).toFixed(2)}`);
  doc.text(`Doadores: ${options.donorCount}`);
  doc.moveDown();

  // Quebra por categoria
  doc.fontSize(14).text('Quebra por Categoria (Despesas)');
  doc.fontSize(10);
  for (const [category, amount] of Object.entries(options.categoryBreakdown)) {
    doc.text(`${category}: R$ ${amount.toFixed(2)}`);
  }
  doc.moveDown();

  // Top doadores
  doc.fontSize(14).text('Top Doadores');
  doc.fontSize(10);
  options.topDonors.slice(0, 10).forEach((donor, index) => {
    doc.text(`${index + 1}. ${donor.name}: R$ ${donor.amount.toFixed(2)}`);
  });
  doc.moveDown();

  // Transações recentes
  doc.addPage();
  doc.fontSize(14).text('Transações Recentes');
  doc.fontSize(10);
  options.recentTransactions.slice(0, 50).forEach((tx) => {
    const icon = tx.type === 'receita' ? '✓' : tx.type === 'despesa' ? '✗' : '→';
    doc.text(
      `${icon} ${tx.type.toUpperCase()} - ${tx.description}: R$ ${tx.amount.toFixed(2)} (${tx.date.toLocaleDateString('pt-BR')})`
    );
  });

  // Rodapé
  doc.fontSize(8).text('Relatório gerado automaticamente pelo sistema Mãos que Constroem', {
    align: 'center',
  });

  doc.end();
  return doc;
}

export function generateCSVReport(options: ReportOptions): string {
  let csv = 'RELATÓRIO DE CAMPANHA\n';
  csv += `${options.campaignTitle}\n`;
  csv += `${options.reportDate.toLocaleDateString('pt-BR')}\n\n`;

  csv += 'RESUMO FINANCEIRO\n';
  csv += `Total Receitas,${options.totalReceitas}\n`;
  csv += `Total Despesas,${options.totalDespesas}\n`;
  csv += `Total Doações,${options.totalDoacoes}\n`;
  csv += `Saldo,${options.totalReceitas - options.totalDespesas}\n\n`;

  csv += 'TOP DOADORES\n';
  csv += 'Nome,Valor\n';
  options.topDonors.forEach((donor) => {
    csv += `"${donor.name}",${donor.amount}\n`;
  });

  csv += '\nTRANSAÇÕES RECENTES\n';
  csv += 'Tipo,Descrição,Valor,Data\n';
  options.recentTransactions.forEach((tx) => {
    csv += `"${tx.type}","${tx.description}",${tx.amount},"${tx.date.toLocaleDateString('pt-BR')}"\n`;
  });

  return csv;
}

export function generateJSONReport(options: ReportOptions): string {
  return JSON.stringify(
    {
      campaign: {
        title: options.campaignTitle,
        description: options.campaignDescription,
        reportDate: options.reportDate.toISOString(),
      },
      summary: {
        totalReceitas: options.totalReceitas,
        totalDespesas: options.totalDespesas,
        totalDoacoes: options.totalDoacoes,
        balance: options.totalReceitas - options.totalDespesas,
        donorCount: options.donorCount,
      },
      categoryBreakdown: options.categoryBreakdown,
      topDonors: options.topDonors,
      recentTransactions: options.recentTransactions.map((tx) => ({
        ...tx,
        date: tx.date.toISOString(),
      })),
    },
    null,
    2
  );
}
