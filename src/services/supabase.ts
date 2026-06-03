
// import { createClient } from '@supabase/supabase-js'
// const supabaseUrl = 'https://qawqoxuphgngjtddhqqy.supabase.co'
// const supabaseKey = "sb_publishable_tT5pOIZjvUiD7l2to4bi2g_6m4tr8HA"
// const supabase = createClient(supabaseUrl, supabaseKey)

// export default supabase

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;