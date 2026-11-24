/**
 * PocketBase Client
 *
 * Adapter para facilitar migração de Supabase para PocketBase
 * API mantém compatibilidade com código existente
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
);

/**
 * Interface compatível com Supabase para facilitar migração
 */
export const pocketbaseServer = () => {
  return {
    // Database operations
    from: (collection: string) => {
      return {
        // SELECT
        select: (fields: string = '*') => ({
          eq: (field: string, value: any) => ({
            single: async () => {
              try {
                const record = await pb.collection(collection).getFirstListItem(
                  `${field} = "${value}"`
                );
                return { data: record, error: null };
              } catch (error) {
                return { data: null, error };
              }
            },
            then: async (callback: (result: any) => void) => {
              const records = await pb.collection(collection).getFullList({
                filter: `${field} = "${value}"`,
              });
              return callback({ data: records, error: null });
            },
          }),
          order: (field: string, { ascending }: { ascending: boolean }) => ({
            then: async (callback: (result: any) => void) => {
              const records = await pb.collection(collection).getFullList({
                sort: ascending ? `+${field}` : `-${field}`,
              });
              return callback({ data: records, error: null });
            },
          }),
        }),

        // INSERT
        insert: (data: any) => ({
          select: () => ({
            then: async (callback: (result: any) => void) => {
              try {
                const record = await pb.collection(collection).create(data);
                return callback({ data: [record], error: null });
              } catch (error) {
                return callback({ data: null, error });
              }
            },
          }),
        }),

        // UPDATE
        update: (data: any) => ({
          eq: (field: string, value: any) => ({
            then: async (callback: (result: any) => void) => {
              try {
                const records = await pb.collection(collection).getFullList({
                  filter: `${field} = "${value}"`,
                });
                const updated = await Promise.all(
                  records.map(r => pb.collection(collection).update(r.id, data))
                );
                return callback({ data: updated, error: null });
              } catch (error) {
                return callback({ data: null, error });
              }
            },
          }),
        }),

        // DELETE
        delete: () => ({
          eq: (field: string, value: any) => ({
            then: async (callback: (result: any) => void) => {
              try {
                const records = await pb.collection(collection).getFullList({
                  filter: `${field} = "${value}"`,
                });
                await Promise.all(
                  records.map(r => pb.collection(collection).delete(r.id))
                );
                return callback({ data: records, error: null });
              } catch (error) {
                return callback({ data: null, error });
              }
            },
          }),
        }),
      };
    },

    // Auth operations
    auth: {
      signUp: async (email: string, password: string) => {
        try {
          const user = await pb.collection('users').create({
            email,
            password,
            passwordConfirm: password,
          });
          return { data: { user }, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          const auth = await pb.collection('users').authWithPassword(email, password);
          return { data: auth, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      signOut: async () => {
        pb.authStore.clear();
        return { error: null };
      },

      session: () => ({
        user: pb.authStore.model,
      }),
    },

    // Storage operations (placeholder)
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          return { data: { path }, error: null };
        },
        download: async (path: string) => {
          return { data: null, error: null };
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `${pb.baseUrl}/files/${path}` },
        }),
      }),
    },
  };
};

export default pb;
