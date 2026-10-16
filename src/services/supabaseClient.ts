import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://xhwisjtwavbuqgfubfig.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_WF-pVzN4zBtLvZmDJriAeQ_YGSUz92p';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
