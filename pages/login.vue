<script setup lang="ts">
/**
 * Login page — email + password only.
 *
 * OWASP notes:
 * - No account enumeration: generic error for both wrong email and wrong password
 * - Rate limiting is handled by Supabase Auth (server-side, not bypassable)
 * - Session stored in HttpOnly SameSite cookie via @supabase/ssr → CSRF-safe
 * - Redirect target is validated to be a relative path (prevents open redirect)
 */
definePageMeta({ layout: false })
useHead({ title: 'Masuk Admin — Paroki Santa Melania' })

const route = useRoute()
const { signIn } = useAuth()

const email = ref('')
const password = ref('')
const errorMsg = ref<string | null>(null)
const loading = ref(false)

// Only allow relative redirects — prevents open-redirect (OWASP A01)
const safeRedirect = computed(() => {
  const r = route.query.redirect as string | undefined
  if (r && r.startsWith('/') && !r.startsWith('//')) return r
  return '/admin'
})

async function onSubmit() {
  if (loading.value) return
  errorMsg.value = null
  loading.value = true

  const err = await signIn(email.value.trim(), password.value)

  loading.value = false

  if (err) {
    // Generic message — no enumeration of which field is wrong
    errorMsg.value = 'Email atau kata sandi tidak valid.'
    password.value = ''
    return
  }

  await navigateTo(safeRedirect.value)
}
</script>

<template>
  <div class="min-h-screen bg-[#faf9f8] flex items-center justify-center p-4">

    <div class="w-full max-w-md">

      <!-- Logo + brand -->
      <div class="flex flex-col items-center mb-8">
        <img
          src="/assets/logo.jpg"
          alt="Logo Paroki Santa Melania"
          class="w-16 h-16 rounded-full object-cover shadow-sm mb-4"
        />
        <h1
          class="text-[#1a3b4c] text-xl font-semibold text-center"
          style="font-family: 'Noto Serif', serif;"
        >
          Paroki Santa Melania
        </h1>
        <p class="text-[#71787c] text-sm mt-1">Portal Admin</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-[#f4f3f2] px-8 py-8">

        <h2
          class="text-[#1a1c1c] text-lg font-semibold mb-1"
          style="font-family: 'Noto Serif', serif;"
        >
          Masuk
        </h2>
        <p class="text-[#71787c] text-sm mb-6">
          Akses terbatas untuk administrator dan pastor.
        </p>

        <!-- Error banner -->
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          leave-active-class="transition-all duration-150"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="errorMsg"
            role="alert"
            class="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5"
          >
            <UIcon name="i-lucide-alert-circle" class="size-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p class="text-red-700 text-sm">{{ errorMsg }}</p>
          </div>
        </Transition>

        <form novalidate @submit.prevent="onSubmit">

          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-[#1a1c1c] mb-1.5">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              :disabled="loading"
              placeholder="admin@paroki-melania.id"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm placeholder:text-[#c1c7cc] focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] disabled:opacity-50 transition"
            />
          </div>

          <!-- Password -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-1.5">
              <label for="password" class="block text-sm font-medium text-[#1a1c1c]">
                Kata Sandi
              </label>
              <NuxtLink
                to="/lupa-sandi"
                class="text-xs text-[#1a3b4c] hover:underline"
              >
                Lupa kata sandi?
              </NuxtLink>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              :disabled="loading"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm placeholder:text-[#c1c7cc] focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] disabled:opacity-50 transition"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !email || !password"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] active:bg-[#12292e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <UIcon v-if="loading" name="i-lucide-loader-circle" class="size-4 animate-spin" />
            <span>{{ loading ? 'Memproses…' : 'Masuk' }}</span>
          </button>

        </form>
      </div>

      <!-- Back to public site -->
      <p class="text-center text-sm text-[#71787c] mt-6">
        <NuxtLink to="/" class="hover:text-[#1a3b4c] transition-colors">
          ← Kembali ke situs paroki
        </NuxtLink>
      </p>
    </div>

  </div>
</template>
