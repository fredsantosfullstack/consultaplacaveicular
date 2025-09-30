import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ufpwyymvlwmjzxovnnfh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmcHd5eW12bHdtanp4b3ZubmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDc5NjEsImV4cCI6MjA3NDgyMzk2MX0.Jpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmcHd5eW12bHdtanp4b3ZubmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDc1NjEsImV4cCI6MjA3NDgyMzk2MX0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
