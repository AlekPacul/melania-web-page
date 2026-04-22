/**
 * Auth route middleware — protects /admin/* routes
 *
 * OWASP A01 (Broken Access Control):
 * - Verifies session server-side via getUser() (not just getSession())
 * - Checks that the user's role is ADMIN or PRIEST before granting access
 * - Non-admin authenticated users are redirected to the public home page
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  const { fetchProfile, isAdmin } = useAuth()

  // Re-fetch on every admin navigation to keep role check fresh
  const p = await fetchProfile()

  if (!p) {
    // Not authenticated — send to login, preserve intended destination
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!isAdmin.value) {
    // Authenticated but lacks admin role — silently redirect home
    return navigateTo('/')
  }
})
