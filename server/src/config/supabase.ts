import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and Service Key are required in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const BUCKET_NAME = 'wedding-photos'; // IMPORTANT: Replace with your actual Supabase bucket name