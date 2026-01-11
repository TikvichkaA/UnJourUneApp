/**
 * SubVeille - Configuration Supabase
 */

const SUPABASE_URL = 'https://zstisdptwxynshftqdln.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdGlzZHB0d3h5bnNoZnRxZGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMzcyNTAsImV4cCI6MjA4MzcxMzI1MH0.hAjvYGa5w-lFgJrz2jqNzSIuHVByghEtplaDswvztwQ';

// Client Supabase global (window.supabase est la lib du CDN, on cree supabaseClient)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
