import { createClient } from '@supabase/supabase-js';

// In production, REQUIRE env vars. In dev, allow fallback to ease local runs.
const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabaseUrl = envUrl;
let supabaseAnonKey = envKey;

if (import.meta.env.PROD) {
  if (!supabaseUrl || !supabaseAnonKey) {
    const msg = '[Supabase] Variáveis ausentes em produção: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas envs do Vercel.';
    // Falhar cedo para evitar conectar ao projeto errado
    console.error(msg);
    throw new Error(msg);
  }
} else {
  // Dev fallback apenas para evitar quebra local
  supabaseUrl = supabaseUrl || 'https://ufpwyymvlwmjzxovnnfh.supabase.co';
  supabaseAnonKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmcHd5eW12bHdtanp4b3ZubmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDc5NjEsImV4cCI6MjA3NDgyMzk2MX0.WkcaJ-01Pf2rX5XqCu0NlihKb9TjhIK7ENshBzTn0QI';
  if (!envUrl || !envKey) {
    console.warn('[Supabase] Usando fallback DEV. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para apontar ao projeto correto.');
  }
}

console.debug('[Supabase] URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
