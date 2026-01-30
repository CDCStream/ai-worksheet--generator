import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client for client-side usage (handles cookies automatically)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server client for server-side usage (without cookie handling)
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// Singleton getter for supabase client
export const getSupabase = () => supabaseServer;
