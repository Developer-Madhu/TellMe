import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client for server-side tasks that need to bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
