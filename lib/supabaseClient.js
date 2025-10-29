import { createBrowserClient } from '@supabase/ssr'

// Create a singleton Supabase client for client-side components
// This ensures we're not creating a new client on every render.
let client
export function getSupabaseBrowserClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return client
}
