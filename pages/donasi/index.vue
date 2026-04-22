<script setup lang="ts">
useHead({
  title: 'Donasi — Paroki Santa Melania Bandung',
  meta: [
    { name: 'description', content: 'Dukung pelayanan Paroki Santa Melania melalui persembahan dan donasi.' },
  ],
})

const banks = [
  {
    name: 'Bank BCA',
    account: '777 – 393 – 777 – 1',
    holder: 'PGAK Santa Melania',
    logo: 'i-lucide-landmark',
  },
  {
    name: 'Bank OCBC NISP',
    account: '010 – 80000 – 665 – 1',
    holder: 'PGAK Santa Melania',
    logo: 'i-lucide-landmark',
  },
]

const ppgBank = {
  name: 'Bank OCBC NISP',
  account: '010 – 8000 – 18755',
  holder: 'PGAK Santa Melania',
}

const copied = ref<string | null>(null)

function copyAccount(account: string) {
  const clean = account.replace(/[\s–-]/g, '')
  navigator.clipboard.writeText(clean)
  copied.value = account
  setTimeout(() => { copied.value = null }, 2000)
}
</script>

<template>
  <main class="pt-16">
    <!-- Hero -->
    <section class="bg-[#f4f3f2] py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Persembahan</p>
        <h1
          class="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4"
          style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
        >
          Donasi & Persembahan
        </h1>
        <p class="text-[#41484b] max-w-xl text-lg leading-relaxed">
          Dukung pelayanan dan pengembangan Paroki Santa Melania melalui persembahan kasih Anda.
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="py-20 bg-[#faf9f8]">
      <div class="max-w-4xl mx-auto px-6 space-y-16">

        <!-- Bank Transfer -->
        <div>
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-[#1a3b4c]/10 rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-building-2" class="size-5 text-[#1a3b4c]" />
            </div>
            <div>
              <h2 class="text-[#1a3b4c] text-xl font-semibold" style="font-family: 'Noto Serif', serif;">Transfer Bank</h2>
              <p class="text-[#41484b] text-sm">Persembahan umum paroki</p>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="bank in banks"
              :key="bank.account"
              class="bg-white rounded-2xl p-6 border border-[#e8e4df]"
            >
              <div class="flex items-center gap-2 mb-4">
                <UIcon :name="bank.logo" class="size-4 text-[#735a3a]" />
                <span class="text-[#735a3a] text-xs font-semibold uppercase tracking-wider">{{ bank.name }}</span>
              </div>
              <p class="text-[#1a3b4c] text-2xl font-semibold tracking-wide mb-1">{{ bank.account }}</p>
              <p class="text-[#41484b] text-sm mb-4">a.n {{ bank.holder }}</p>
              <button
                class="flex items-center gap-1.5 text-xs font-medium text-[#1a3b4c] hover:text-[#735a3a] transition-colors"
                @click="copyAccount(bank.account)"
              >
                <UIcon :name="copied === bank.account ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5" />
                {{ copied === bank.account ? 'Tersalin!' : 'Salin nomor rekening' }}
              </button>
            </div>
          </div>
        </div>

        <!-- PPG Section -->
        <div>
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-[#735a3a]/10 rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-church" class="size-5 text-[#735a3a]" />
            </div>
            <div>
              <h2 class="text-[#1a3b4c] text-xl font-semibold" style="font-family: 'Noto Serif', serif;">Transfer PPG</h2>
              <p class="text-[#41484b] text-sm">Persembahan Pengembangan Gereja</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-[#e8e4df] sm:max-w-sm">
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-landmark" class="size-4 text-[#735a3a]" />
              <span class="text-[#735a3a] text-xs font-semibold uppercase tracking-wider">{{ ppgBank.name }}</span>
            </div>
            <p class="text-[#1a3b4c] text-2xl font-semibold tracking-wide mb-1">{{ ppgBank.account }}</p>
            <p class="text-[#41484b] text-sm mb-4">a.n {{ ppgBank.holder }}</p>
            <button
              class="flex items-center gap-1.5 text-xs font-medium text-[#1a3b4c] hover:text-[#735a3a] transition-colors"
              @click="copyAccount(ppgBank.account)"
            >
              <UIcon :name="copied === ppgBank.account ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3.5" />
              {{ copied === ppgBank.account ? 'Tersalin!' : 'Salin nomor rekening' }}
            </button>
          </div>
        </div>

        <!-- QRIS -->
        <div>
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 bg-[#1a3b4c]/10 rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-qr-code" class="size-5 text-[#1a3b4c]" />
            </div>
            <div>
              <h2 class="text-[#1a3b4c] text-xl font-semibold" style="font-family: 'Noto Serif', serif;">QRIS</h2>
              <p class="text-[#41484b] text-sm">Scan & bayar dengan aplikasi e-wallet apapun</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-8 border border-[#e8e4df] inline-block">
            <img
              src="/assets/qris.png"
              alt="QRIS PGAK Santa Melania"
              class="w-64 h-64 object-contain mx-auto"
            />
            <p class="text-center text-[#41484b] text-sm mt-4">PGAK Santa Melania</p>
            <div class="mt-4 text-center">
              <a
                href="/assets/qris.png"
                download="QRIS-PGAK-Santa-Melania.png"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a3b4c] hover:text-[#735a3a] transition-colors"
              >
                <UIcon name="i-lucide-download" class="size-3.5" />
                Unduh gambar QRIS
              </a>
            </div>
          </div>
        </div>

        <!-- WhatsApp CTA -->
        <div class="bg-[#1a3b4c] rounded-2xl p-8 text-center">
          <p class="text-white/70 text-sm mb-2">Ada pertanyaan mengenai donasi?</p>
          <p class="text-white text-lg font-medium mb-6" style="font-family: 'Noto Serif', serif;">
            Hubungi sekretariat paroki kami
          </p>
          <a
            href="https://wa.me/6281321272634"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a3b4c] text-sm font-medium rounded-full hover:bg-[#f4f3f2] transition-colors"
          >
            <UIcon name="i-lucide-message-circle" class="size-4" />
            Hubungi via WhatsApp
          </a>
        </div>

      </div>
    </section>
  </main>
</template>
