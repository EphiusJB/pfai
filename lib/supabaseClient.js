// Compatibility shim: forgot-password, reset-password and verify-email import
// `{ supabase }` from "@/lib/supabaseClient", which didn't exist. Re-export the shared anon client.
export { default as supabase } from "@/lib/supabase/anon";
