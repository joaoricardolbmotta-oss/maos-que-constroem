/**
 * DEPRECATED: Use lib/pocketbase.ts instead
 *
 * This file kept for compatibility during migration.
 * All functionality has been moved to PocketBase.
 */

import pb from './pocketbase';

export const supabaseServer = () => pb;
export const supabaseClient = () => pb;

export default pb;
