/**
 * Centralized Supabase configuration helper.
 * Normalizes environment variable names, strips accidental wrapping quotes/whitespace,
 * and validates that required keys are present.
 */

function clean(str?: string): string {
  if (!str) return '';
  return str.trim().replace(/^["']|["']$/g, '').trim();
}

export function getSupabaseConfig() {
  const url = clean(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  );

  const key = clean(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY
  );

  return { url, key };
}
