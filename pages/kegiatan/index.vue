<script setup lang="ts">
useHead({
  title: 'Kegiatan & Pengumuman — Paroki Santa Melania',
  meta: [
    { name: 'description', content: 'Kegiatan, pengumuman, dan jadwal liturgi Paroki Santa Melania Bandung.' },
  ],
})

const supabase = useSupabase()
const { getCachedData, markFetched } = usePageCache()

// ── Types ──────────────────────────────────────────────────────────────────
type Category = 'pengumuman' | 'kegiatan' | 'liturgi' | 'sosial'

interface Activity {
  id: string
  title: string
  description: string | null
  activity_date: string
  activity_time: string | null
  location: string | null
  category: Category
  image_url: string | null
}

// ── Fetch published activities ─────────────────────────────────────────────
const { data: activities, error } = await useAsyncData('kegiatan', async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('id, title, description, activity_date, activity_time, location, category, image_url')
    .eq('is_published', true)
    .order('activity_date', { ascending: true })
  if (error) throw error
  markFetched('kegiatan')
  return data as Activity[]
}, { getCachedData: (key) => getCachedData(key) })

// ── Category metadata ────────────────────────────────────────────────────────
const CATEGORIES: { value: Category | ''; label: string; icon: string; color: string; bg: string }[] = [
  { value: '',          label: 'Semua',       icon: 'i-lucide-layout-grid',   color: 'text-[#1a3b4c]', bg: 'bg-[#1a3b4c]' },
  { value: 'pengumuman',label: 'Pengumuman',  icon: 'i-lucide-megaphone',     color: 'text-blue-600',  bg: 'bg-blue-600' },
  { value: 'kegiatan',  label: 'Kegiatan',    icon: 'i-lucide-calendar-days', color: 'text-green-600', bg: 'bg-green-600' },
  { value: 'liturgi',   label: 'Liturgi',     icon: 'i-lucide-church',        color: 'text-amber-600', bg: 'bg-amber-600' },
  { value: 'sosial',    label: 'Sosial',      icon: 'i-lucide-users',         color: 'text-purple-600',bg: 'bg-purple-600' },
]

const CAT_ICON: Record<Category, string> = {
  pengumuman: 'i-lucide-megaphone',
  kegiatan:   'i-lucide-calendar-days',
  liturgi:    'i-lucide-church',
  sosial:     'i-lucide-users',
}

const CAT_COLORS: Record<Category, { icon: string; badge: string; dotBg: string }> = {
  pengumuman: { icon: 'text-blue-500',   badge: 'bg-blue-50 text-blue-700',   dotBg: 'bg-blue-100' },
  kegiatan:   { icon: 'text-green-500',  badge: 'bg-green-50 text-green-700', dotBg: 'bg-green-100' },
  liturgi:    { icon: 'text-amber-500',  badge: 'bg-amber-50 text-amber-700', dotBg: 'bg-amber-100' },
  sosial:     { icon: 'text-purple-500', badge: 'bg-purple-50 text-purple-700', dotBg: 'bg-purple-100' },
}

// ── Filter ───────────────────────────────────────────────────────────────────
const activeCategory = ref<Category | ''>('')

const today = new Date()
today.setHours(0, 0, 0, 0)

const filteredActivities = computed(() => {
  if (!activities.value) return []
  if (!activeCategory.value) return activities.value
  return activities.value.filter(a => a.category === activeCategory.value)
})

const upcoming = computed(() =>
  filteredActivities.value.filter(a => new Date(a.activity_date) >= today),
)

const past = computed(() =>
  filteredActivities.value.filter(a => new Date(a.activity_date) < today).reverse(),
)

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function fmtTime(t: string | null) {
  return t ? t.slice(0, 5) : null
}

function catLabel(c: Category) {
  return CATEGORIES.find(x => x.value === c)?.label ?? c
}
</script>

<template>
  <main class="pt-16">

    <!-- ── Header ───────────────────────────────────────────────────── -->
    <section class="bg-[#f4f3f2] py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Komunitas</p>
        <h1
          class="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4"
          style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
        >
          Kegiatan & Pengumuman
        </h1>
        <p class="text-[#41484b] max-w-xl text-lg leading-relaxed">
          Tetap terhubung dengan kehidupan komunitas Paroki Santa Melania — kegiatan, pengumuman, dan momen liturgi bersama.
        </p>
      </div>
    </section>

    <!-- ── Error ─────────────────────────────────────────────────────── -->
    <section v-if="error" class="py-20 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
          <UIcon name="i-lucide-alert-circle" class="size-5 flex-shrink-0" />
          <p>Gagal memuat kegiatan. Silakan coba beberapa saat lagi.</p>
        </div>
      </div>
    </section>

    <template v-else>
      <!-- ── Category filter ─────────────────────────────────────────── -->
      <section class="bg-white border-b border-[#f4f3f2] sticky top-16 z-30">
        <div class="max-w-7xl mx-auto px-6 lg:px-12">
          <div class="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
            <button
              v-for="cat in CATEGORIES"
              :key="cat.value"
              class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0"
              :class="activeCategory === cat.value
                ? `${cat.bg} text-white`
                : 'bg-[#f4f3f2] text-[#41484b] hover:bg-[#eae9e7]'"
              @click="activeCategory = cat.value"
            >
              <UIcon :name="cat.icon" class="size-4" />
              {{ cat.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- ── Content ────────────────────────────────────────────────── -->
      <section class="py-16 bg-[#faf9f8]">
        <div class="max-w-7xl mx-auto px-6 lg:px-12 space-y-14">

          <!-- Empty state -->
          <div v-if="filteredActivities.length === 0" class="text-center py-16">
            <UIcon name="i-lucide-calendar-x" class="size-12 text-[#c1c7cc] mx-auto mb-4" />
            <p class="text-[#71787c]">Belum ada kegiatan yang dipublikasikan.</p>
          </div>

          <template v-else>
            <!-- Upcoming -->
            <div v-if="upcoming.length > 0">
              <h2
                class="text-[#1a3b4c] text-xl font-semibold mb-6 flex items-center gap-2"
                style="font-family: 'Noto Serif', serif;"
              >
                <UIcon name="i-lucide-calendar-clock" class="size-5" />
                Akan Datang
              </h2>
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <NuxtLink
                  v-for="a in upcoming"
                  :key="a.id"
                  :to="`/kegiatan/${a.id}`"
                  class="bg-white rounded-2xl overflow-hidden editorial-shadow hover:shadow-md transition-shadow group block"
                  tag="article"
                >
                  <!-- Image cover or category bar -->
                  <div v-if="a.image_url" class="relative h-40 overflow-hidden">
                    <img :src="a.image_url" :alt="a.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span
                      class="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                      :class="CAT_COLORS[a.category].badge"
                    >
                      <UIcon :name="CAT_ICON[a.category]" class="size-3" />
                      {{ catLabel(a.category) }}
                    </span>
                  </div>
                  <div
                    v-else
                    class="h-1.5"
                    :class="{
                      'bg-blue-500':   a.category === 'pengumuman',
                      'bg-green-500':  a.category === 'kegiatan',
                      'bg-amber-500':  a.category === 'liturgi',
                      'bg-purple-500': a.category === 'sosial',
                    }"
                  />

                  <div class="p-5">
                    <!-- Category badge (only when no image cover) -->
                    <div v-if="!a.image_url" class="flex items-center gap-2 mb-3">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        :class="CAT_COLORS[a.category].badge"
                      >
                        <UIcon :name="CAT_ICON[a.category]" class="size-3" />
                        {{ catLabel(a.category) }}
                      </span>
                    </div>

                    <!-- Title -->
                    <h3
                      class="text-[#1a1c1c] font-semibold text-base leading-snug mb-3 group-hover:text-[#1a3b4c] transition-colors"
                      style="font-family: 'Noto Serif', serif;"
                    >
                      {{ a.title }}
                    </h3>

                    <!-- Description -->
                    <p v-if="a.description" class="text-[#71787c] text-sm leading-relaxed line-clamp-2 mb-4">
                      {{ a.description }}
                    </p>

                    <!-- Meta -->
                    <div class="space-y-1.5 pt-3 border-t border-[#f4f3f2]">
                      <div class="flex items-center gap-2 text-xs text-[#41484b]">
                        <UIcon name="i-lucide-calendar" class="size-3.5 flex-shrink-0" />
                        <span>{{ fmtDate(a.activity_date) }}</span>
                      </div>
                      <div v-if="fmtTime(a.activity_time)" class="flex items-center gap-2 text-xs text-[#41484b]">
                        <UIcon name="i-lucide-clock" class="size-3.5 flex-shrink-0" />
                        <span>Pukul {{ fmtTime(a.activity_time) }}</span>
                      </div>
                      <div v-if="a.location" class="flex items-center gap-2 text-xs text-[#41484b]">
                        <UIcon name="i-lucide-map-pin" class="size-3.5 flex-shrink-0" />
                        <span>{{ a.location }}</span>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- Past -->
            <div v-if="past.length > 0">
              <h2
                class="text-[#1a3b4c] text-xl font-semibold mb-6 flex items-center gap-2"
                style="font-family: 'Noto Serif', serif;"
              >
                <UIcon name="i-lucide-history" class="size-5" />
                Telah Berlangsung
              </h2>
              <div class="space-y-3">
                <NuxtLink
                  v-for="a in past"
                  :key="a.id"
                  :to="`/kegiatan/${a.id}`"
                  class="bg-white/60 rounded-2xl px-5 py-4 flex gap-4 editorial-shadow opacity-70 hover:opacity-90 transition-opacity block"
                  tag="article"
                >
                  <!-- Icon -->
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    :class="CAT_COLORS[a.category].dotBg"
                  >
                    <UIcon :name="CAT_ICON[a.category]" class="size-4" :class="CAT_COLORS[a.category].icon" />
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <span class="text-[#1a1c1c] font-semibold text-sm">{{ a.title }}</span>
                      <span
                        class="text-xs px-2 py-0.5 rounded-full"
                        :class="CAT_COLORS[a.category].badge"
                      >{{ catLabel(a.category) }}</span>
                    </div>
                    <div class="flex flex-wrap gap-x-3 text-xs text-[#71787c]">
                      <span class="flex items-center gap-1">
                        <UIcon name="i-lucide-calendar" class="size-3" />
                        {{ fmtDate(a.activity_date) }}
                      </span>
                      <span v-if="a.location" class="flex items-center gap-1">
                        <UIcon name="i-lucide-map-pin" class="size-3" />
                        {{ a.location }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </template>

        </div>
      </section>

    </template>

    <!-- ── CTA ───────────────────────────────────────────────────────── -->
    <section class="py-20 bg-[#1a3b4c]">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <h2 class="text-white text-3xl font-semibold mb-4" style="font-family: 'Noto Serif', serif;">
          Ingin Mengadakan Kegiatan?
        </h2>
        <p class="text-white/60 mb-8">
          Hubungi sekretariat paroki untuk mengajukan kegiatan komunitas atau pelayanan di Paroki Santa Melania.
        </p>
        <a
          href="https://wa.me/6281321272634"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a3b4c] text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
        >
          Hubungi Sekretariat
        </a>
      </div>
    </section>

  </main>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
