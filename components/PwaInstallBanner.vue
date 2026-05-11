<script setup lang="ts">
const { $pwa } = useNuxtApp()

const mounted = ref(false)
const dismissed = ref(false)
const isIOS = ref(false)
const isStandalone = ref(false)

onMounted(() => {
  mounted.value = true
  dismissed.value = localStorage.getItem('pwa-banner-dismissed') === 'true'
  isIOS.value = /iphone|ipad|ipod/i.test(navigator.userAgent)
  isStandalone.value =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
})

const canInstall = computed(() => !!($pwa as { showInstallPrompt?: { value: boolean } } | undefined)?.showInstallPrompt?.value)

const show = computed(() => {
  if (!mounted.value || dismissed.value || isStandalone.value) return false
  return canInstall.value || isIOS.value
})

function install() {
  ;($pwa as { install?: () => void } | undefined)?.install?.()
  dismissed.value = true
}

function dismiss() {
  dismissed.value = true
  localStorage.setItem('pwa-banner-dismissed', 'true')
  if (canInstall.value) {
    ;($pwa as { cancelInstall?: () => void } | undefined)?.cancelInstall?.()
  }
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-[4.5rem] md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-[21rem] z-40"
    >
      <div class="bg-white rounded-2xl border border-[#e8e4df] editorial-shadow overflow-hidden">
        <!-- Top bar accent -->
        <div class="h-1 w-full bg-[#1a3b4c]" />

        <div class="p-4">
          <div class="flex items-start gap-3">
            <!-- App icon -->
            <img
              src="/assets/pwa-192x192.png"
              alt="Ikon Aplikasi Paroki Santa Melania"
              class="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />

            <div class="flex-1 min-w-0">
              <p class="text-[#1a3b4c] font-semibold text-sm leading-snug" style="font-family: 'Noto Serif', serif;">
                Pasang di Perangkat Anda
              </p>
              <p v-if="isIOS" class="text-[#41484b] text-xs leading-relaxed mt-1">
                Ketuk ikon <strong>Bagikan</strong>
                <UIcon name="i-lucide-share" class="inline w-3 h-3 mx-0.5 align-text-bottom" />
                lalu pilih <strong>"Tambahkan ke Layar Utama"</strong>.
              </p>
              <p v-else class="text-[#41484b] text-xs leading-relaxed mt-1">
                Akses jadwal misa & info paroki lebih cepat dari layar utama ponsel Anda.
              </p>
            </div>

            <!-- Close -->
            <button
              aria-label="Tutup"
              class="text-[#71787c] hover:text-[#1a3b4c] transition-colors flex-shrink-0 p-0.5 -mr-1 -mt-0.5"
              @click="dismiss"
            >
              <UIcon name="i-lucide-x" class="w-4 h-4" />
            </button>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 mt-3">
            <template v-if="!isIOS">
              <button
                class="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1a3b4c] text-white text-xs font-semibold rounded-full hover:bg-[#335264] transition-colors"
                @click="install"
              >
                <UIcon name="i-lucide-download" class="w-3.5 h-3.5" />
                Pasang Aplikasi
              </button>
              <button
                class="px-4 py-2 text-[#41484b] text-xs font-medium rounded-full border border-[#c1c7cc] hover:bg-[#f4f3f2] transition-colors"
                @click="dismiss"
              >
                Nanti
              </button>
            </template>
            <template v-else>
              <button
                class="flex-1 px-4 py-2 text-[#41484b] text-xs font-medium rounded-full border border-[#c1c7cc] hover:bg-[#f4f3f2] transition-colors"
                @click="dismiss"
              >
                Mengerti
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(0.75rem);
  opacity: 0;
}
</style>
