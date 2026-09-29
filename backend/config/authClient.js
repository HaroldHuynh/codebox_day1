const { createClient } = require("@supabase/supabase-js");

// Keep Auth session state separate from the server's privileged database
// client. A signUp call can establish a user session on its client, which
// would otherwise cause subsequent profile inserts to be evaluated by RLS.
const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
);

module.exports = authClient;
