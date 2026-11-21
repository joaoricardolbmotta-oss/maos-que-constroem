export type CampaignDateMode = 'single' | 'period' | 'none';
export type CampaignStatus = 'draft' | 'planned' | 'active' | 'finished';
export type MaterialCategory = 'alimentos' | 'higiene' | 'roupas' | 'brinquedos' | 'outros';
export type UserRole = 'admin' | 'master';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campanha {
  id: string;
  title: string;
  description: string | null;
  institution: string;
  public_slug: string;
  date_mode: CampaignDateMode;
  action_date: string | null;
  end_date: string | null;
  fundraising_goal: number | null;
  status: CampaignStatus;
  estimated_audience: number | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Receita {
  id: string;
  campaign_id: string;
  description: string;
  amount: number;
  source: string;
  donor_name: string | null;
  donor_cpf: string | null;
  receipt_number: string | null;
  receipt_date: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Despesa {
  id: string;
  campaign_id: string;
  description: string;
  category: string;
  amount: number;
  expense_date: string;
  vendor_name: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface DoacaoMaterial {
  id: string;
  campaign_id: string;
  item_name: string;
  category: MaterialCategory;
  quantity: number;
  unit: string | null;
  donor_name: string | null;
  donor_cpf: string | null;
  received_date: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface OrcamentoItem {
  id: string;
  campaign_id: string;
  name: string;
  category: string;
  quantity: number;
  unit_value: number;
  planned_total: number;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface Comprovante {
  id: string;
  campaign_id: string;
  type: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  storage_url: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
  has_personal_data: boolean;
  masking_status: 'pending' | 'masked' | 'skipped';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
