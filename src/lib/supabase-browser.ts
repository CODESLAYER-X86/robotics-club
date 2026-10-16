import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from './supabase-config';

/** Supabase browser client — used only for Google OAuth sign-in. */
export function createSupabaseBrowser() {
  const { url, key } = getSupabaseConfig();
  return createBrowserClient(url, key);
}
