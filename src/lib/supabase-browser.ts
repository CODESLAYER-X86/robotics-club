import { createBrowserClient } from '@supabase/ssr';

/** Supabase browser client — used only for Google OAuth sign-in. */
export function createSupabaseBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
  return createBrowserClient(supabaseUrl, supabaseKey);
}
