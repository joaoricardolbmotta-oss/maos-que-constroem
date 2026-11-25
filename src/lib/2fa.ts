

/**
 * Two-Factor Authentication (2FA) com TOTP
 */

export async function enable2FA(userId: string) {
  try {
    const speakeasy = require('speakeasy');

    // Gera novo secret
    const secret = speakeasy.generateSecret({
      name: 'Mãos que Constroem',
      issuer: 'maosqueconstroem.com',
      length: 32,
    });

    import pb from '@/lib/pocketbase';
  // TODO: Migrate to PocketBase

    // Salva secret no banco (não verificado ainda)
    await supabase.from('user_2fa').upsert([
      {
        user_id: userId,
        secret: secret.base32,
        enabled: false,
        backup_codes: generateBackupCodes(),
      },
    ]);

    return {
      secret: secret.base32,
      qr_code: secret.otpauth_url,
    };
  } catch (error) {
    console.error('Enable 2FA error:', error);
    throw error;
  }
}

export async function verify2FA(userId: string, token: string) {
  try {
    const speakeasy = require('speakeasy');
    import pb from '@/lib/pocketbase';
  // TODO: Migrate to PocketBase

    // Busca secret
    const { data: twoFA } = await supabase
      .from('user_2fa')
      .select('secret')
      .eq('user_id', userId)
      .single();

    if (!twoFA) {
      throw new Error('2FA not found');
    }

    // Verifica token
    const verified = speakeasy.totp.verify({
      secret: twoFA.secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 steps in either direction
    });

    if (!verified) {
      throw new Error('Invalid token');
    }

    // Habilita 2FA
    await supabase
      .from('user_2fa')
      .update({ enabled: true })
      .eq('user_id', userId);

    return true;
  } catch (error) {
    console.error('Verify 2FA error:', error);
    throw error;
  }
}

export async function disable2FA(userId: string, password: string) {
  try {
    import pb from '@/lib/pocketbase';
  // TODO: Migrate to PocketBase

    // Verificar senha
    // (em produção, fazer isso via RPC seguro do Supabase)

    // Desabilita 2FA
    await supabase
      .from('user_2fa')
      .update({ enabled: false })
      .eq('user_id', userId);

    return true;
  } catch (error) {
    console.error('Disable 2FA error:', error);
    throw error;
  }
}

export async function validateTOTP(userId: string, token: string): Promise<boolean> {
  try {
    const speakeasy = require('speakeasy');
    import pb from '@/lib/pocketbase';
  // TODO: Migrate to PocketBase

    const { data: twoFA } = await supabase
      .from('user_2fa')
      .select('secret, enabled')
      .eq('user_id', userId)
      .single();

    if (!twoFA || !twoFA.enabled) {
      return true; // 2FA not enabled
    }

    const verified = speakeasy.totp.verify({
      secret: twoFA.secret,
      encoding: 'base32',
      token,
      window: 2,
    });

    return verified;
  } catch (error) {
    console.error('Validate TOTP error:', error);
    return false;
  }
}

export async function generateBackupCodes(count: number = 10): Promise<string[]> {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    codes.push(code);
  }
  return codes;
}

export async function useBackupCode(userId: string, code: string): Promise<boolean> {
  try {
    import pb from '@/lib/pocketbase';
  // TODO: Migrate to PocketBase

    const { data: twoFA } = await supabase
      .from('user_2fa')
      .select('backup_codes')
      .eq('user_id', userId)
      .single();

    if (!twoFA || !twoFA.backup_codes.includes(code)) {
      return false;
    }

    // Remove backup code
    const updatedCodes = twoFA.backup_codes.filter((c: string) => c !== code);

    await supabase
      .from('user_2fa')
      .update({ backup_codes: updatedCodes })
      .eq('user_id', userId);

    return true;
  } catch (error) {
    console.error('Use backup code error:', error);
    return false;
  }
}
