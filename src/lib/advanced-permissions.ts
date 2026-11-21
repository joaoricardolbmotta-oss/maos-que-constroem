/**
 * Advanced Permissions & Custom Roles
 * Fase 40: Dynamic Role-Based Access Control
 */

export type Permission =
  | 'campaign:read'
  | 'campaign:write'
  | 'campaign:delete'
  | 'receita:read'
  | 'receita:write'
  | 'receita:delete'
  | 'despesa:read'
  | 'despesa:write'
  | 'despesa:delete'
  | 'doacao:read'
  | 'doacao:write'
  | 'comprovante:upload'
  | 'comprovante:delete'
  | 'member:manage'
  | 'webhook:manage'
  | 'template:manage'
  | 'api:manage'
  | 'audit:read'
  | 'report:export'
  | 'settings:manage';

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PRESET_ROLES = {
  owner: {
    name: 'Proprietário',
    permissions: [
      'campaign:read',
      'campaign:write',
      'campaign:delete',
      'receita:read',
      'receita:write',
      'receita:delete',
      'despesa:read',
      'despesa:write',
      'despesa:delete',
      'doacao:read',
      'comprovante:upload',
      'comprovante:delete',
      'member:manage',
      'webhook:manage',
      'template:manage',
      'api:manage',
      'audit:read',
      'report:export',
      'settings:manage',
    ] as Permission[],
  },
  editor: {
    name: 'Editor',
    permissions: [
      'campaign:read',
      'campaign:write',
      'receita:read',
      'receita:write',
      'despesa:read',
      'despesa:write',
      'doacao:read',
      'comprovante:upload',
      'report:export',
      'audit:read',
    ] as Permission[],
  },
  viewer: {
    name: 'Visualizador',
    permissions: ['campaign:read', 'receita:read', 'despesa:read', 'doacao:read', 'audit:read', 'report:export'] as Permission[],
  },
  accountant: {
    name: 'Contador',
    permissions: [
      'campaign:read',
      'receita:read',
      'receita:write',
      'despesa:read',
      'despesa:write',
      'doacao:read',
      'comprovante:upload',
      'report:export',
      'audit:read',
    ] as Permission[],
  },
};

export function hasPermission(role: CustomRole | string, permission: Permission): boolean {
  if (typeof role === 'string') {
    const presetRole = PRESET_ROLES[role as keyof typeof PRESET_ROLES];
    return presetRole?.permissions.includes(permission) ?? false;
  }

  return role.permissions.includes(permission);
}

export function canAccessResource(
  role: CustomRole | string,
  resource: string,
  action: 'read' | 'write' | 'delete'
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(role, permission);
}

export function filterPermissions(allPermissions: Permission[], requiredPermissions: Permission[]): Permission[] {
  return allPermissions.filter((p) => requiredPermissions.includes(p));
}

export async function createCustomRole(
  campaignId: string,
  name: string,
  description: string,
  permissions: Permission[]
): Promise<CustomRole> {
  // Validar permissões
  const validPermissions = permissions.filter((p) => isValidPermission(p));

  // Salvar em banco
  const role: CustomRole = {
    id: `role_${Date.now()}`,
    name,
    description,
    permissions: validPermissions,
    campaignId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // await supabaseServer().from('custom_roles').insert([role]);

  return role;
}

function isValidPermission(permission: Permission): boolean {
  const validPermissions = Object.values(PRESET_ROLES)
    .flatMap((r) => r.permissions)
    .filter((p, i, arr) => arr.indexOf(p) === i);

  return validPermissions.includes(permission);
}

export function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    'campaign:read': 'Ver campanhas',
    'campaign:write': 'Editar campanhas',
    'campaign:delete': 'Deletar campanhas',
    'receita:read': 'Ver receitas',
    'receita:write': 'Editar receitas',
    'receita:delete': 'Deletar receitas',
    'despesa:read': 'Ver despesas',
    'despesa:write': 'Editar despesas',
    'despesa:delete': 'Deletar despesas',
    'doacao:read': 'Ver doações',
    'doacao:write': 'Editar doações',
    'comprovante:upload': 'Upload de comprovantes',
    'comprovante:delete': 'Deletar comprovantes',
    'member:manage': 'Gerenciar membros',
    'webhook:manage': 'Gerenciar webhooks',
    'template:manage': 'Gerenciar templates',
    'api:manage': 'Gerenciar API keys',
    'audit:read': 'Ver audit logs',
    'report:export': 'Exportar relatórios',
    'settings:manage': 'Gerenciar configurações',
  };

  return descriptions[permission] || permission;
}
