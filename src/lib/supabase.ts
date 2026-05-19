import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Lifemarks] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Data will only be stored locally until you connect Supabase.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export type SupabaseUser = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];
