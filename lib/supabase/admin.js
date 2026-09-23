// Service-role client — bypasses RLS. Server-side only, used after
// the API layer has already verified ownership. NEVER import this
// from a "use client" component or expose it to the browser bundle.

// import "server-only";

import { createClient } from "@supabase/supabase-js";
import env from "../env.js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabaseAdmin;
