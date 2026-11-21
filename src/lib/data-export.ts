/**
 * Data Export Utilities
 * Fase 33: Data Export (CSV/JSON/Excel)
 */

export function exportToCSV(data: any[], fileName: string) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.map((h) => `"${h}"`).join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        return String(value);
      })
    ),
  ].join('\n');

  downloadFile(csv, `${fileName}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToJSON(data: any[], fileName: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${fileName}.json`, 'application/json;charset=utf-8;');
}

export function exportToExcel(data: any[], fileName: string) {
  // Simple XLSX generation (requires additional library like xlsx)
  // For now, we'll create a TSV which Excel can open natively
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const tsv = [
    headers.join('\t'),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return value === null || value === undefined ? '' : String(value);
      })
    ),
  ].join('\n');

  downloadFile(tsv, `${fileName}.xlsx`, 'text/tab-separated-values;charset=utf-8;');
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function exportCampaignData(campaign: any) {
  const data = {
    campaign: {
      id: campaign.id,
      title: campaign.title,
      slug: campaign.slug,
      description: campaign.description,
      status: campaign.status,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    },
    receitas: campaign.receitas || [],
    despesas: campaign.despesas || [],
    doacoes: campaign.doacoes || [],
    members: campaign.members || [],
    exportedAt: new Date().toISOString(),
  };

  exportToJSON([data], `campaign-${campaign.slug}-${Date.now()}`);
}

export function exportTransactions(transactions: any[]) {
  const formatted = transactions.map((tx) => ({
    type: tx.type,
    description: tx.description,
    amount: tx.amount,
    category: tx.category,
    date: new Date(tx.created_at).toLocaleDateString('pt-BR'),
    status: tx.status,
    notes: tx.notes,
  }));

  exportToCSV(formatted, `transactions-${Date.now()}`);
}

export function exportDonors(donors: any[]) {
  const formatted = donors.map((donor) => ({
    name: donor.name,
    email: donor.email,
    amount: donor.total_amount,
    donationCount: donor.donation_count,
    lastDonation: new Date(donor.last_donation).toLocaleDateString('pt-BR'),
    createdAt: new Date(donor.created_at).toLocaleDateString('pt-BR'),
  }));

  exportToCSV(formatted, `donors-${Date.now()}`);
}

export function exportMembers(members: any[]) {
  const formatted = members.map((member) => ({
    name: member.name,
    email: member.email,
    role: member.role,
    addedAt: new Date(member.created_at).toLocaleDateString('pt-BR'),
  }));

  exportToCSV(formatted, `members-${Date.now()}`);
}
