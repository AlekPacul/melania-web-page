<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Lupa Kata Sandi — Paroki Santa Melania' })

const { sendPasswordReset } = useAuth()

const email = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const sent = ref(false)

async function onSubmit() {
  if (loading.value) return
  errorMsg.value = null
  loading.value = true

  const err = await sendPasswordReset(email.value.trim())
  loading.value = false

  if (err) {
    // Generic message — no account enumeration
    errorMsg.value = 'Gagal mengirim email. Coba lagi beberapa saat.'
    return
  }

  sent.value = true
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

        <!-- Success state -->
        <div v-if="sent" class="text-center">
          <div class="flex items-center justify-center w-12 h-12 bg-green-50 rounded-full mx-auto mb-4">
            <UIcon name="i-lucide-mail-check" class="size-6 text-green-600" />
          </div>
          <h2
            class="text-[#1a1c1c] text-lg font-semibold mb-2"
            style="font-family: 'Noto Serif', serif;"
          >
            Email terkirim
          </h2>
          <p class="text-[#71787c] text-sm mb-6">
            Instruksi reset kata sandi telah dikirim ke <strong class="text-[#1a1c1c]">{{ email }}</strong>.
            Periksa kotak masuk atau folder spam Anda.
          </p>
          <NuxtLink
            to="/login"
            class="inline-flex items-center gap-2 text-sm text-[#1a3b4c] font-medium hover:underline"
          >
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            Kembali ke halaman masuk
          </NuxtLink>
        </div>

        <!-- Form state -->
        <template v-else>
          <h2
            class="text-[#1a1c1c] text-lg font-semibold mb-1"
            style="font-family: 'Noto Serif', serif;"
          >
            Lupa Kata Sandi
          </h2>
          <p class="text-[#71787c] text-sm mb-6">
            Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
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
            <div class="mb-6">
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

            <button
              type="submit"
              :disabled="loading || !email"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a3b4c] text-white text-sm font-medium hover:bg-[#16333f] active:bg-[#12292e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <UIcon v-if="loading" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              <span>{{ loading ? 'Mengirim…' : 'Kirim Tautan Reset' }}</span>
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
