import { createClient } from "@supabase/supabase-js";
import env from "../env.js";

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default supabaseAnon;
// , {
//   auth: {
//     autoRefreshToken: false,
//     persistSession: false,
//     detectSessionInUrl: false,
//   },
// }