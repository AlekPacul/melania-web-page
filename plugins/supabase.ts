/**
 * Universal Supabase plugin
 *
 * Server side: creates a per-request client using the H3 event from
 * nuxtApp.ssrContext — avoids the "composable outside Nuxt instance"
 * error that occurs when useRequestEvent() is called from async callbacks
 * (e.g. Supabase's internal _emitInitialSession).
 *
 * Client side: uses createBrowserClient with cookie storage (no localStorage).
 */
import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'
import { appendResponseHeader, getHeader } from 'h3'

export default defineNuxtPlugin({
  name: 'supabase',
  enforce: 'pre',
  setup(nuxtApp) {
    const config = useRuntimeConfig()
    const url = config.public.supabaseUrl as string
    const key = config.public.supabaseKey as string

    if (import.meta.server) {
      // Access the H3 event directly from ssrContext — safe to call
      // from async callbacks because it's a plain object reference,
      // not a Nuxt composable lookup.
      const event = nuxtApp.ssrContext?.event ?? null

      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            if (!event) return []
            return parseCookieHeader(getHeader(event, 'cookie') ?? '')
              .map(({ name, value }) => ({ name, value: value ?? '' }))
          },
          setAll(cookiesToSet) {
            if (!event) return
            cookiesToSet.forEach(({ name, value, options }) => {
              appendResponseHeader(
                event,
                'Set-Cookie',
                serializeCookieHeader(name, value, options),
              )
            })
          },
        },
      })

      return { provide: { supabase } }
    }

    // Browser: session stored in cookies (not localStorage) — CSRF-safe
    const supabase = createBrowserClient(url, key)
    return { provide: { supabase } }
  },
})
