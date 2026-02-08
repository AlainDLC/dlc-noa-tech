import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Detta är hjärtat i kopplingen - glöm inte ordet 'export'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log(
  "Kollar env:",
  process.env.NEXT_PUBLIC_SUPABASE_URL ? "HITTAD" : "SAKNAS",
);
