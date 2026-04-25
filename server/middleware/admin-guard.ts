/**
 * Server-side admin guard — OWASP A01 (Broken Access Control)
 *
 * Validates the Supabase session on the Nitro server before rendering any
 * /admin/* route. Without this, the SSR server would return HTTP 200 with the
 * full admin page HTML to unauthenticated users (pentest finding F-03).
 *
 * Flow:
 *  1. Fast path: no Supabase auth cookie → 302 to /login immediately.
 *  2. Slow path: cookie present → call getUser() to validate the JWT server-side.
 *     An expired or forged token fails here before any page content is rendered.
 */
import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { getHeader, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/admin')) return

  const config = useRuntimeConfig(event)
  const cookieHeader = getHeader(event, 'cookie') ?? ''
  const cookies = parseCookieHeader(cookieHeader).map(({ name, value }) => ({
    name,
    value: value ?? '',
  }))

  // Fast path: definitely not authenticated
  const hasAuthCookie = cookies.some(
    ({ name }) => name.startsWith('sb-') && name.endsWith('-auth-token'),
  )
  if (!hasAuthCookie) {
    return sendRedirect(event, `/login?redirect=${encodeURIComponent(event.path)}`, 302)
  }

  // Validate session with Supabase — getUser() hits the auth server, so a
  // tampered or expired JWT will be rejected here before HTML is rendered.
  const supabase = createServerClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string,
    {
      cookies: {
        getAll: () => cookies,
        setAll: () => {},
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return sendRedirect(event, `/login?redirect=${encodeURIComponent(event.path)}`, 302)
  }
})
