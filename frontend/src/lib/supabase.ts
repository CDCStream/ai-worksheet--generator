import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client - SSR package handles singleton internally
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Singleton getter for supabase client
export const getSupabase = () => supabase;
