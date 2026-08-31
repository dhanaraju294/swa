import { createClient } from '@supabase/supabase-js';

// Public anon key only — never the service_role key.
export const SUPABASE_URL = 'https://jsumpnqarpjwjtjephgk.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdW1wbnFhcnBqd2p0amVwaGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTAzOTYsImV4cCI6MjEwMzc2NjM5Nn0.Avr-DnyFoB9kQZnTnfma_19qF6pGvpUNIhYRDV57sU4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
