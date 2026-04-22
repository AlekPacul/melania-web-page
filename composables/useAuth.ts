/**
 * useAuth — reactive auth state + helpers
 *
 * Role is read from app_metadata (JWT claim) — NOT the users table.
 * This means auth works even when PostgREST is unavailable, and avoids
 * the security risk of using user_metadata (which is user-editable).
 *
 * app_metadata is set server-side only and is safe for authorization.
 */

export type UserRole = 'GUEST' | 'MEMBER' | 'ADMIN' | 'PRIEST'

export interface AuthProfile {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export const useAuth = () => {
  const supabase = useSupabase()
  const profile = useState<AuthProfile | null>('auth:profile', () => null)

  /**
   * Fetch the current user from Supabase Auth (validates JWT server-side)
   * and read role from app_metadata — no PostgREST / users table query.
   */
  async function fetchProfile(): Promise<AuthProfile | null> {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      profile.value = null
      return null
    }

    const role = (user.app_metadata?.role as UserRole) ?? 'GUEST'

    profile.value = {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name ?? user.email ?? null,
      role,
    }

    return profile.value
  }

  /** Sign in with email + password. Returns error string or null. */
  async function signIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return error.message
    await fetchProfile()
    return null
  }

  /** Sign out and clear profile state. */
  async function signOut(): Promise<void> {
    await supabase.auth.signOut()
    profile.value = null
  }

  /** Send a password-reset email. Returns error string or null. */
  async function sendPasswordReset(email: string): Promise<string | null> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-sandi`,
    })
    if (error) return error.message
    return null
  }

  /** Update the authenticated user's password (call after reset callback). Returns error string or null. */
  async function updatePassword(newPassword: string): Promise<string | null> {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return error.message
    return null
  }

  const isAdmin = computed(() =>
    profile.value?.role === 'ADMIN' || profile.value?.role === 'PRIEST',
  )

  return { profile, isAdmin, fetchProfile, signIn, signOut, sendPasswordReset, updatePassword }
}
