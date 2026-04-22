<script setup lang="ts">
useHead({
  title: 'Pelayanan Paroki — Paroki Santa Melania',
  meta: [
    { name: 'description', content: 'Bergabunglah dalam berbagai pelayanan aktif Paroki Santa Melania Bandung — Ekaristi, Katekese, OMK, dan lebih banyak lagi.' },
  ],
})

const supabase = useSupabase()
const { getCachedData, markFetched } = usePageCache()

// ── Types ──────────────────────────────────────────────────────────────────
type MinistryColor = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'teal' | 'indigo'

interface Ministry {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string
  color: MinistryColor
  image_url: string | null
  meeting_schedule: string | null
  sort_order: number
}

// ── Color map — explicit classes so Tailwind includes them ────────────────
const COLOR_MAP: Record<MinistryColor, { bg: string; text: string; icon: string; bar: string; soft: string }> = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: 'text-blue-600',   bar: 'bg-blue-500',   soft: 'bg-blue-50' },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  icon: 'text-green-600',  bar: 'bg-green-500',  soft: 'bg-green-50' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: 'text-amber-600',  bar: 'bg-amber-500',  soft: 'bg-amber-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600', bar: 'bg-purple-500', soft: 'bg-purple-50' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    icon: 'text-red-600',    bar: 'bg-red-500',    soft: 'bg-red-50' },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-700',   icon: 'text-teal-600',   bar: 'bg-teal-500',   soft: 'bg-teal-50' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-600', bar: 'bg-indigo-500', soft: 'bg-indigo-50' },
}

function c(color: MinistryColor) {
  return COLOR_MAP[color] ?? COLOR_MAP.blue
}

// ── Fetch ────────────────────────────────────────────────────────────────
const { data: ministries, error } = await useAsyncData('pelayanan', async () => {
  const { data, error } = await supabase
    .from('ministries')
    .select('id, name, slug, description, icon, color, image_url, meeting_schedule, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  markFetched('pelayanan')
  return data as Ministry[]
}, { getCachedData: (key) => getCachedData(key) })
</script>

<template>
  <main class="pt-16">

    <!-- ── Hero ────────────────────────────────────────────────────── -->
    <section class="bg-[#f4f3f2] py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Paroki</p>
        <h1
          class="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4"
          style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
        >
          Pelayanan Paroki
        </h1>
        <p class="text-[#41484b] max-w-xl text-lg leading-relaxed">
          Temukan panggilan Anda untuk melayani Tuhan dan sesama melalui berbagai kelompok pelayanan aktif di Paroki Santa Melania Bandung.
        </p>
      </div>
    </section>

    <!-- ── Error ─────────────────────────────────────────────────── -->
    <section v-if="error" class="py-20 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
          <UIcon name="i-lucide-alert-circle" class="size-5 flex-shrink-0" />
          <p>Gagal memuat data pelayanan. Silakan coba beberapa saat lagi.</p>
        </div>
      </div>
    </section>

    <!-- ── Empty ─────────────────────────────────────────────────── -->
    <section v-else-if="!ministries?.length" class="py-32 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <UIcon name="i-lucide-heart-handshake" class="size-12 text-[#c1c7cc] mx-auto mb-4" />
        <p class="text-[#71787c]">Informasi pelayanan belum tersedia.</p>
      </div>
    </section>

    <!-- ── Ministry cards ────────────────────────────────────────── -->
    <section v-else class="py-16 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="m in ministries"
            :key="m.id"
            :to="`/pelayanan/${m.slug}`"
            class="group bg-white rounded-2xl overflow-hidden editorial-shadow hover:shadow-md transition-all hover:-translate-y-0.5 block"
          >
            <!-- Image header or color bar -->
            <div v-if="m.image_url" class="relative h-44 overflow-hidden">
              <img :src="m.image_url" :alt="m.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div
                class="absolute top-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center"
                :class="c(m.color).bg"
              >
                <UIcon :name="m.icon" class="size-5" :class="c(m.color).icon" />
              </div>
            </div>
            <div v-else class="h-1.5" :class="c(m.color).bar" />

            <div class="p-6">
              <!-- Icon row (when no image) -->
              <div v-if="!m.image_url" class="flex items-center gap-3 mb-4">
                <div
                  class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  :class="c(m.color).bg"
                >
                  <UIcon :name="m.icon" class="size-5" :class="c(m.color).icon" />
                </div>
                <span
                  class="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  :class="[c(m.color).soft, c(m.color).text]"
                >
                  Pelayanan
                </span>
              </div>

              <!-- Name -->
              <h2
                class="text-[#1a3b4c] font-semibold text-lg leading-snug mb-2 group-hover:text-[#16333f] transition-colors"
                style="font-family: 'Noto Serif', serif;"
              >
                {{ m.name }}
              </h2>

              <!-- Description -->
              <p v-if="m.description" class="text-[#71787c] text-sm leading-relaxed line-clamp-3 mb-4">
                {{ m.description }}
              </p>

              <!-- Meeting schedule -->
              <div v-if="m.meeting_schedule" class="flex items-center gap-2 text-xs text-[#41484b] mb-4">
                <UIcon name="i-lucide-clock" class="size-3.5 flex-shrink-0" />
                <span>{{ m.meeting_schedule }}</span>
              </div>

              <!-- CTA -->
              <div class="flex items-center gap-1.5 text-sm font-medium" :class="c(m.color).icon">
                Pelajari lebih lanjut
                <UIcon name="i-lucide-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ── CTA ──────────────────────────────────────────────────── -->
    <section class="py-20 bg-[#1a3b4c]">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <h2 class="text-white text-3xl font-semibold mb-4" style="font-family: 'Noto Serif', serif;">
          Siap Bergabung dalam Pelayanan?
        </h2>
        <p class="text-white/60 mb-8 leading-relaxed">
          Hubungi sekretariat paroki atau langsung temui koordinator pelayanan yang ingin Anda ikuti.
        </p>
        <a
          href="https://wa.me/6281321272634"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a3b4c] text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
        >
          <UIcon name="i-lucide-message-circle" class="size-4" />
          Hubungi Sekretariat
        </a>
      </div>
    </section>

  </main>
</template>
