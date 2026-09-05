import { createClient } from "@supabase/supabase-js";

/**
 * Server-side data client using the service role key.
 *
 * Auth (who is logged in) is handled by the ct_session cookie, not Supabase
 * Auth, so we don't need auth cookies here. The service role bypasses RLS so
 * server components and actions can read/write the seeded demo data directly.
 * Never expose this key to the browser.
 */
export async function createSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
