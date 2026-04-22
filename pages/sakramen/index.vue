<script setup lang="ts">
useHead({
  title: 'Sakramen — Paroki Santa Melania Bandung',
  meta: [
    { name: 'description', content: 'Informasi lengkap mengenai penerimaan tujuh Sakramen Gereja Katolik di Paroki Santa Melania Bandung.' },
  ],
})

const { getAll } = useSakramen()
const sakramen = getAll()
</script>

<template>
  <main class="pt-16">
    <!-- Hero -->
    <section class="bg-[#f4f3f2] py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Paroki Santa Melania</p>
        <h1
          class="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4"
          style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
        >
          Sakramen Gereja
        </h1>
        <p class="text-[#41484b] text-lg max-w-2xl leading-relaxed">
          Sakramen adalah tanda dan sarana rahmat Allah yang mempererat persekutuan umat dengan Kristus dan Gereja-Nya.
          Temukan informasi persyaratan dan tata cara penerimaan sakramen di paroki kami.
        </p>
      </div>
    </section>

    <!-- Sakramen Grid -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="s in sakramen"
            :key="s.slug"
            :to="`/sakramen/${s.slug}`"
            class="group bg-white border border-[#e8e4e0] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div :class="['h-1.5 w-full', s.colorBar]" />
            <div class="p-6">
              <div :class="['w-11 h-11 rounded-xl flex items-center justify-center mb-4', s.colorBadge]">
                <UIcon :name="s.icon" :class="['w-5 h-5', s.colorIcon]" />
              </div>
              <span :class="['text-xs font-semibold uppercase tracking-wider mb-1 block', s.colorIcon]">
                {{ s.subtitle }}
              </span>
              <h2
                class="text-[#1a3b4c] text-xl font-semibold mb-2 group-hover:text-[#335264] transition-colors"
                style="font-family: 'Noto Serif', serif;"
              >
                Sakramen {{ s.title }}
              </h2>
              <p class="text-[#41484b] text-sm leading-relaxed line-clamp-3">{{ s.description }}</p>
              <div class="mt-4 flex items-center gap-1 text-[#1a3b4c] text-sm font-medium">
                Lihat selengkapnya
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Contact Banner -->
    <section class="py-16 bg-[#f4f3f2]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <UIcon name="i-lucide-phone" class="w-8 h-8 text-[#735a3a] mx-auto mb-4" />
        <h2
          class="text-[#1a3b4c] text-2xl font-semibold mb-3"
          style="font-family: 'Noto Serif', serif;"
        >
          Butuh Informasi Lebih Lanjut?
        </h2>
        <p class="text-[#41484b] text-base mb-6 max-w-xl mx-auto">
          Sekretariat paroki siap membantu Anda mempersiapkan penerimaan sakramen.
          Kunjungi kami atau hubungi via WhatsApp.
        </p>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
        >
          <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
          Hubungi via WhatsApp
        </a>
      </div>
    </section>
  </main>
</template>
