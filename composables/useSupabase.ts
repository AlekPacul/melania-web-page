import type { SupabaseClient } from '@supabase/supabase-js'

/** Returns the Supabase client injected by the plugin. */
export const useSupabase = (): SupabaseClient => {
  const { $supabase } = useNuxtApp()
  return $supabase as SupabaseClient
}
