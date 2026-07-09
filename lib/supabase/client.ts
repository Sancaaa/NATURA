import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "./config";

/** Klien Supabase untuk komponen client (browser). */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
