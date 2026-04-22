<script setup lang="ts">
/**
 * Password-reset callback page.
 *
 * Supabase uses PKCE flow by default: the reset link arrives with ?code=xxx
 * in the query string. We exchange that code for a session, then let the user
 * set a new password. Falls back to onAuthStateChange for legacy implicit flow.
 */
definePageMeta({ layout: false })
useHead({ title: 'Reset Kata Sandi — Paroki Santa Melania' })

const supabase = useSupabase()
const { updatePassword } = useAuth()
const route = useRoute()

type Stage = 'waiting' | 'ready' | 'done' | 'invalid'

const stage = ref<Stage>('waiting')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  // PKCE flow: ?code=xxx in the URL
  const code = route.query.code as string | undefined
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    stage.value = error ? 'invalid' : 'ready'
    return
  }

  // Legacy implicit flow: #access_token=...&type=recovery in hash
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      stage.value = 'ready'
    }
  })
  onUnmounted(() => subscription.unsubscribe())

  // Timeout: if no event arrives in 10s the link is invalid/expired
  setTimeout(() => {
    if (stage.value === 'waiting') stage.value = 'invalid'
  }, 10_000)
})

const passwordMismatch = computed(
  () => confirmPassword.value.length > 0 && newPassword.value !== confirmPassword.value,
)

async function onSubmit() {
  if (loading.value) return
  if (newPassword.value !== confirmPassword.value) return
  if (newPassword.value.length < 8) {
    errorMsg.value = 'Kata sandi minimal 8 karakter.'
    return
  }

  errorMsg.value = null
  loading.value = true

  const err = await updatePassword(newPassword.value)
  loading.value = false

  if (err) {
    errorMsg.value = 'Gagal memperbarui kata sandi. Tautan mungkin sudah kedaluwarsa.'
    return
  }

  stage.value = 'done'
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

        <!-- Waiting for token -->
        <div v-if="stage === 'waiting'" class="text-center py-4">
          <UIcon name="i-lucide-loader-circle" class="size-8 text-[#1a3b4c] animate-spin mx-auto mb-3" />
          <p class="text-[#71787c] text-sm">Memverifikasi tautan reset…</p>
        </div>

        <!-- Invalid / expired link -->
        <div v-else-if="stage === 'invalid'" class="text-center">
          <div class="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
            <UIcon name="i-lucide-link-2-off" class="size-6 text-red-500" />
          </div>
          <h2
            class="text-[#1a1c1c] text-lg font-semibold mb-2"
            style="font-family: 'Noto Serif', serif;"
          >
            Tautan tidak valid
          </h2>
          <p class="text-[#71787c] text-sm mb-6">
            Tautan reset telah kedaluwarsa atau sudah digunakan. Silakan minta tautan baru.
          </p>
          <NuxtLink
            to="/lupa-sandi"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
          >
            Minta tautan baru
          </NuxtLink>
        </div>

        <!-- Success state -->
        <div v-else-if="stage === 'done'" class="text-center">
          <div class="flex items-center justify-center w-12 h-12 bg-green-50 rounded-full mx-auto mb-4">
            <UIcon name="i-lucide-shield-check" class="size-6 text-green-600" />
          </div>
          <h2
            class="text-[#1a1c1c] text-lg font-semibold mb-2"
            style="font-family: 'Noto Serif', serif;"
          >
            Kata sandi berhasil diperbarui
          </h2>
          <p class="text-[#71787c] text-sm mb-6">
            Kata sandi Anda telah diubah. Silakan masuk dengan kata sandi baru.
          </p>
          <NuxtLink
            to="/login"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] transition-colors"
          >
            <UIcon name="i-lucide-log-in" class="size-4" />
            Masuk sekarang
          </NuxtLink>
        </div>

        <!-- Ready: set new password -->
        <template v-else-if="stage === 'ready'">
          <h2
            class="text-[#1a1c1c] text-lg font-semibold mb-1"
            style="font-family: 'Noto Serif', serif;"
          >
            Buat Kata Sandi Baru
          </h2>
          <p class="text-[#71787c] text-sm mb-6">
            Masukkan kata sandi baru Anda. Minimal 8 karakter.
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
            <div class="mb-4">
              <label for="new-password" class="block text-sm font-medium text-[#1a1c1c] mb-1.5">
                Kata Sandi Baru
              </label>
              <input
                id="new-password"
                v-model="newPassword"
                type="password"
                autocomplete="new-password"
                required
                minlength="8"
                :disabled="loading"
                placeholder="••••••••"
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#d9d9d9] bg-white text-[#1a1c1c] text-sm placeholder:text-[#c1c7cc] focus:outline-none focus:ring-2 focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c] disabled:opacity-50 transition"
              />
            </div>

            <div class="mb-6">
              <label for="confirm-password" class="block text-sm font-medium text-[#1a1c1c] mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                :disabled="loading"
                placeholder="••••••••"
                :class="[
                  'w-full px-3.5 py-2.5 rounded-xl border bg-white text-[#1a1c1c] text-sm placeholder:text-[#c1c7cc] focus:outline-none focus:ring-2 disabled:opacity-50 transition',
                  passwordMismatch
                    ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                    : 'border-[#d9d9d9] focus:ring-[#1a3b4c]/30 focus:border-[#1a3b4c]',
                ]"
              />
              <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1.5">
                Kata sandi tidak cocok.
              </p>
            </div>

            <button
              type="submit"
              :disabled="loading || !newPassword || !confirmPassword || passwordMismatch"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] active:bg-[#12292e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <UIcon v-if="loading" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              <span>{{ loading ? 'Menyimpan…' : 'Simpan Kata Sandi Baru' }}</span>
            </button>
          </form>
        </template>

      </div>

      <p class="text-center text-sm text-[#71787c] mt-6">
        <NuxtLink to="/login" class="hover:text-[#1a3b4c] transition-colors">
          ← Kembali ke halaman masuk
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
