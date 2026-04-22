/**
 * Client-only plugin that keeps auth state in sync with Supabase token lifecycle.
 *
 * We read from the `session` argument directly — NOT via getUser() — because
 * onAuthStateChange holds the Navigator Lock internally. Calling getUser()
 * inside the callback tries to re-acquire the same lock, causing
 * NavigatorLockAcquireTimeoutError and degraded performance.
 *
 * Security: the auth middleware still calls getUser() (server-validated) on
 * every /admin navigation. This plugin only keeps client UI state in sync.
 */
import type { UserRole } from '~/composables/useAuth'

export default defineNuxtPlugin(() => {
  const supabase = useSupabase()
  const { profile } = useAuth()
  const router = useRouter()
  const route = useRoute()

  supabase.auth.onAuthStateChange((event, session) => {
    switch (event) {
      case 'INITIAL_SESSION':
      case 'SIGNED_IN':
      case 'TOKEN_REFRESHED':
      case 'USER_UPDATED':
        if (session?.user) {
          const u = session.user
          profile.value = {
            id: u.id,
            email: u.email ?? '',
            name: u.user_metadata?.name ?? u.email ?? null,
            role: (u.app_metadata?.role as UserRole) ?? 'GUEST',
          }
        } else {
          profile.value = null
        }
        break

      case 'SIGNED_OUT':
        profile.value = null
        if (route.path.startsWith('/admin')) {
          router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
        }
        break
    }
  })
})
