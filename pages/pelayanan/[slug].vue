<script setup lang="ts">
const route = useRoute()
const supabase = useSupabase()
const { getCachedData, markFetched } = usePageCache()

type MinistryColor = 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'teal' | 'indigo'

interface Ministry {
  id: string
  name: string
  slug: string
  description: string | null
  long_description: string | null
  icon: string
  color: MinistryColor
  image_url: string | null
  meeting_schedule: string | null
  contact_name: string | null
  contact_phone: string | null
}

const COLOR_MAP: Record<MinistryColor, { bg: string; text: string; icon: string; bar: string; soft: string; border: string }> = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: 'text-blue-600',   bar: 'bg-blue-600',   soft: 'bg-blue-50',   border: 'border-blue-200' },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  icon: 'text-green-600',  bar: 'bg-green-600',  soft: 'bg-green-50',  border: 'border-green-200' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: 'text-amber-600',  bar: 'bg-amber-600',  soft: 'bg-amber-50',  border: 'border-amber-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600', bar: 'bg-purple-600', soft: 'bg-purple-50', border: 'border-purple-200' },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    icon: 'text-red-600',    bar: 'bg-red-600',    soft: 'bg-red-50',    border: 'border-red-200' },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-700',   icon: 'text-teal-600',   bar: 'bg-teal-600',   soft: 'bg-teal-50',   border: 'border-teal-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-600', bar: 'bg-indigo-600', soft: 'bg-indigo-50', border: 'border-indigo-200' },
}

const cacheKey = `pelayanan-${route.params.slug}`

const { data: ministry, error } = await useAsyncData(cacheKey, async () => {
  const { data, error } = await supabase
    .from('ministries')
    .select('id, name, slug, description, long_description, icon, color, image_url, meeting_schedule, contact_name, contact_phone')
    .eq('slug', route.params.slug as string)
    .eq('is_published', true)
    .single()
  if (error) throw error
  markFetched(cacheKey)
  return data as Ministry
}, { getCachedData: (key) => getCachedData(key) })

if (!error.value && !ministry.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pelayanan tidak ditemukan' })
}

const col = computed(() => {
  const color = ministry.value?.color ?? 'blue'
  return COLOR_MAP[color as MinistryColor] ?? COLOR_MAP.blue
})

useHead(() => ({
  title: ministry.value ? `${ministry.value.name} — Paroki Santa Melania` : 'Pelayanan',
  meta: [
    { name: 'description', content: ministry.value?.description ?? 'Detail pelayanan Paroki Santa Melania Bandung.' },
  ],
}))

function waLink(phone: string | null) {
  if (!phone) return null
  const clean = phone.replace(/\D/g, '')
  const normalized = clean.startsWith('0') ? '62' + clean.slice(1) : clean
  return `https://wa.me/${normalized}`
}
</script>

<template>
  <main class="pt-16">

    <!-- ── 404 / error ───────────────────────────────────────────── -->
    <section v-if="error || !ministry" class="py-32 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <UIcon name="i-lucide-alert-circle" class="size-12 text-[#c1c7cc] mx-auto mb-4" />
        <p class="text-[#71787c] mb-6">Pelayanan tidak ditemukan.</p>
        <NuxtLink
          to="/pelayanan"
          class="inline-flex items-center gap-2 text-[#1a3b4c] text-sm font-medium hover:underline"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4" />
          Kembali ke daftar pelayanan
        </NuxtLink>
      </div>
    </section>

    <template v-else>
      <!-- ── Hero ──────────────────────────────────────────────────── -->
      <section class="relative overflow-hidden">
        <!-- Image header -->
        <div v-if="ministry.image_url" class="relative h-64 lg:h-80">
          <img :src="ministry.image_url" :alt="ministry.name" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-8 lg:p-12 max-w-7xl mx-auto">
            <NuxtLink
              to="/pelayanan"
              class="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-medium mb-4 transition-colors"
            >
              <UIcon name="i-lucide-arrow-left" class="size-3.5" />
              Semua Pelayanan
            </NuxtLink>
            <h1
              class="text-white text-3xl lg:text-5xl font-semibold leading-tight"
              style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
            >
              {{ ministry.name }}
            </h1>
          </div>
        </div>

        <!-- Colored hero (no image) -->
        <div v-else class="bg-[#f4f3f2] py-16 lg:py-20">
          <div class="max-w-7xl mx-auto px-6 lg:px-12">
            <NuxtLink
              to="/pelayanan"
              class="inline-flex items-center gap-1.5 text-[#735a3a] hover:text-[#1a3b4c] text-xs font-medium mb-6 transition-colors"
            >
              <UIcon name="i-lucide-arrow-left" class="size-3.5" />
              Semua Pelayanan
            </NuxtLink>

            <div class="flex items-start gap-5">
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1"
                :class="col.bg"
              >
                <UIcon :name="ministry.icon" class="size-8" :class="col.icon" />
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] mb-2" :class="col.text">Pelayanan Paroki</p>
                <h1
                  class="text-[#1a3b4c] text-3xl lg:text-5xl font-semibold leading-tight"
                  style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
                >
                  {{ ministry.name }}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Content ───────────────────────────────────────────────── -->
      <section class="py-16 bg-[#faf9f8]">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
          <div class="grid lg:grid-cols-3 gap-10">

            <!-- Main content -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Short description -->
              <p v-if="ministry.description" class="text-[#41484b] text-lg leading-relaxed">
                {{ ministry.description }}
              </p>

              <!-- Long description -->
              <div v-if="ministry.long_description">
                <div class="h-px bg-[#e8e4df] mb-8" />
                <div
                  class="prose prose-sm max-w-none text-[#41484b] leading-relaxed whitespace-pre-line"
                  style="font-size: 1rem;"
                >
                  {{ ministry.long_description }}
                </div>
              </div>
            </div>

            <!-- Sidebar info -->
            <div class="space-y-4">

              <!-- Meeting schedule -->
              <div
                v-if="ministry.meeting_schedule"
                class="rounded-2xl p-5 border"
                :class="[col.soft, col.border]"
              >
                <div class="flex items-center gap-2 mb-2">
                  <UIcon name="i-lucide-clock" class="size-4" :class="col.icon" />
                  <p class="text-xs font-semibold uppercase tracking-wider" :class="col.text">Jadwal Pertemuan</p>
                </div>
                <p class="text-[#1a1c1c] text-sm font-medium">{{ ministry.meeting_schedule }}</p>
              </div>

              <!-- Contact person -->
              <div
                v-if="ministry.contact_name || ministry.contact_phone"
                class="bg-white rounded-2xl p-5 border border-[#e8e4df] editorial-shadow"
              >
                <div class="flex items-center gap-2 mb-3">
                  <UIcon name="i-lucide-user-circle" class="size-4 text-[#735a3a]" />
                  <p class="text-xs font-semibold uppercase tracking-wider text-[#735a3a]">Koordinator</p>
                </div>
                <p v-if="ministry.contact_name" class="text-[#1a1c1c] font-semibold text-sm mb-1">
                  {{ ministry.contact_name }}
                </p>
                <a
                  v-if="ministry.contact_phone && waLink(ministry.contact_phone)"
                  :href="waLink(ministry.contact_phone)!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
                >
                  <UIcon name="i-lucide-message-circle" class="size-4" />
                  {{ ministry.contact_phone }}
                </a>
              </div>

              <!-- Join CTA card -->
              <div class="bg-[#1a3b4c] rounded-2xl p-5 text-center">
                <UIcon name="i-lucide-heart-handshake" class="size-8 text-white/40 mx-auto mb-3" />
                <p class="text-white font-semibold text-sm mb-1" style="font-family: 'Noto Serif', serif;">
                  Tertarik Bergabung?
                </p>
                <p class="text-white/60 text-xs mb-4 leading-relaxed">
                  Hubungi sekretariat atau koordinator pelayanan untuk informasi lebih lanjut.
                </p>
                <a
                  href="https://wa.me/6281321272634"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#1a3b4c] text-xs font-semibold rounded-full hover:bg-white/90 transition-colors"
                >
                  <UIcon name="i-lucide-message-circle" class="size-3.5" />
                  Hubungi Sekretariat
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      <!-- ── Other ministries ──────────────────────────────────────── -->
      <section class="py-12 bg-white border-t border-[#f4f3f2]">
        <div class="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <p class="text-[#71787c] text-sm">Temukan pelayanan lainnya di Paroki Santa Melania</p>
          <NuxtLink
            to="/pelayanan"
            class="inline-flex items-center gap-1.5 text-[#1a3b4c] text-sm font-medium hover:underline"
          >
            Lihat semua pelayanan
            <UIcon name="i-lucide-arrow-right" class="size-4" />
          </NuxtLink>
        </div>
      </section>
    </template>

  </main>
</template>
