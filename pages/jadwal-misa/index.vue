<script setup lang="ts">
useHead({
  title: 'Jadwal Misa — Paroki Santa Melania Bandung',
  meta: [
    { name: 'description', content: 'Jadwal Misa Paroki Santa Melania Bandung. Misa harian Senin–Jumat pukul 06:00, Sabtu 17:00, Minggu 06:30 & 09:00.' },
  ],
})

const supabase = useSupabase()
const { getCachedData, markFetched } = usePageCache()

// ── Fetch active weekly schedules ─────────────────────────────────────
const { data: scheduleRows, error } = await useAsyncData('mass-schedules', async () => {
  const { data, error } = await supabase
    .from('mass_schedules')
    .select('day_label, mass_time, mass_type, note, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  markFetched('mass-schedules')
  return data
}, { getCachedData: (key) => getCachedData(key) })

// ── Fetch upcoming special / holiday schedules ────────────────────────
const { data: specialRows } = await useAsyncData('special-mass-schedules', async () => {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('special_mass_schedules')
    .select('event_name, event_date, mass_time, mass_type, note, location, sort_order')
    .eq('is_active', true)
    .gte('event_date', today)
    .or(`dismiss_after.is.null,dismiss_after.gt.${today}`)
    .order('event_date', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) return []
  markFetched('special-mass-schedules')
  return data
}, { getCachedData: (key) => getCachedData(key) })

// ── Group by day_label ────────────────────────────────────────────────
interface MassRow {
  day_label: string
  mass_time: string
  mass_type: string
  note: string | null
  sort_order: number
}

const weeklySchedule = computed(() => {
  if (!scheduleRows.value) return []
  const map = new Map<string, { day: string; masses: { time: string; type: string; note: string }[] }>()
  for (const row of scheduleRows.value as MassRow[]) {
    const time = row.mass_time.slice(0, 5)
    const entry = map.get(row.day_label) ?? { day: row.day_label, masses: [] }
    entry.masses.push({ time, type: row.mass_type, note: row.note ?? '' })
    map.set(row.day_label, entry)
  }
  return Array.from(map.values())
})

interface SpecialRow {
  event_name: string
  event_date: string
  mass_time: string
  mass_type: string
  note: string | null
  location: string | null
  sort_order: number
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

const guidelines = [
  { icon: '👔', title: 'Busana Sopan', desc: 'Kenakan pakaian yang sopan dan layak untuk memasuki rumah Tuhan.' },
  { icon: '🕐', title: 'Hadir Tepat Waktu', desc: 'Diharapkan hadir 10–15 menit sebelum Misa dimulai.' },
  { icon: '🍞', title: 'Puasa Ekaristi', desc: 'Puasa selama 1 jam sebelum menerima Komuni Kudus.' },
  { icon: '📵', title: 'Nonaktifkan Ponsel', desc: 'Matikan atau silent ponsel selama perayaan berlangsung.' },
]
</script>

<template>
  <main class="pt-16">
    <!-- Header -->
    <section class="bg-[#f4f3f2] py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Liturgi</p>
        <h1 class="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4" style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;">
          Jadwal Misa
        </h1>
        <p class="text-[#41484b] max-w-xl text-lg leading-relaxed">
          Bergabunglah bersama umat Paroki Santa Melania dalam perayaan Ekaristi. Jadwal dapat berubah sesuai kalender liturgi.
        </p>
      </div>
    </section>

    <!-- Error state -->
    <section v-if="error" class="py-20 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
          <UIcon name="i-lucide-alert-circle" class="size-5 flex-shrink-0" />
          <p>Gagal memuat jadwal. Silakan coba beberapa saat lagi atau hubungi sekretariat paroki.</p>
        </div>
      </div>
    </section>

    <!-- Weekly Schedule -->
    <section v-else class="py-20 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 class="text-[#1a3b4c] text-2xl font-semibold mb-10" style="font-family: 'Noto Serif', serif;">
          Jadwal Mingguan
        </h2>

        <!-- Loading skeleton -->
        <div v-if="!scheduleRows" class="space-y-6">
          <div v-for="n in 4" :key="n" class="bg-white rounded-2xl overflow-hidden editorial-shadow animate-pulse">
            <div class="bg-[#1a3b4c]/20 h-12" />
            <div class="px-6 py-5 space-y-2">
              <div class="h-4 bg-[#f4f3f2] rounded w-1/3" />
            </div>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div v-for="schedule in weeklySchedule" :key="schedule.day" class="bg-white rounded-2xl overflow-hidden editorial-shadow">
            <div class="bg-[#1a3b4c] px-6 py-4">
              <h3 class="text-white font-semibold" style="font-family: 'Noto Serif', serif;">{{ schedule.day }}</h3>
            </div>
            <div class="divide-y divide-[#f4f3f2]">
              <div
                v-for="mass in schedule.masses"
                :key="mass.type"
                class="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div class="flex items-center gap-6">
                  <span class="text-[#1a3b4c] text-2xl font-semibold w-16" style="font-family: 'Noto Serif', serif;">{{ mass.time }}</span>
                  <span class="text-[#1a1c1c] font-medium">{{ mass.type }}</span>
                </div>
                <span v-if="mass.note" class="text-xs bg-[#fddab2] text-[#735a3a] px-3 py-1 rounded-full font-medium self-start sm:self-auto">
                  {{ mass.note }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-[#71787c] text-sm mt-6 italic">
          * Jadwal dapat berubah sewaktu-waktu sesuai kalender liturgi. Periksa warta jemaat untuk perubahan jadwal hari raya.
        </p>
      </div>
    </section>

    <!-- Special / Holiday Schedule -->
    <section v-if="specialRows && specialRows.length > 0" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center gap-3 mb-10">
          <UIcon name="i-lucide-calendar-heart" class="size-6 text-[#735a3a]" />
          <h2 class="text-[#1a3b4c] text-2xl font-semibold" style="font-family: 'Noto Serif', serif;">
            Jadwal Khusus & Hari Raya
          </h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="s in (specialRows as SpecialRow[])"
            :key="s.event_date + s.mass_time"
            class="bg-[#faf9f8] border border-[#f4f3f2] rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <!-- Date badge -->
            <div class="flex-shrink-0 w-16 text-center bg-[#1a3b4c] rounded-xl py-2.5 px-1">
              <p class="text-white/70 text-xs uppercase tracking-wide leading-none mb-1">
                {{ new Date(s.event_date + 'T00:00:00').toLocaleDateString('id-ID', { month: 'short' }) }}
              </p>
              <p class="text-white text-2xl font-semibold leading-none" style="font-family: 'Noto Serif', serif;">
                {{ new Date(s.event_date + 'T00:00:00').getDate() }}
              </p>
              <p class="text-white/70 text-xs leading-none mt-1">
                {{ new Date(s.event_date + 'T00:00:00').getFullYear() }}
              </p>
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <p class="text-[#71787c] text-xs mb-0.5">{{ formatDate(s.event_date) }}</p>
              <h3 class="text-[#1a3b4c] font-semibold" style="font-family: 'Noto Serif', serif;">
                {{ s.event_name }}
              </h3>
              <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                <span class="flex items-center gap-1.5 text-[#41484b] text-sm">
                  <UIcon name="i-lucide-clock" class="size-3.5 text-[#735a3a]" />
                  {{ s.mass_time.slice(0, 5) }} — {{ s.mass_type }}
                </span>
                <span v-if="s.location" class="flex items-center gap-1.5 text-[#41484b] text-sm">
                  <UIcon name="i-lucide-map-pin" class="size-3.5 text-[#735a3a]" />
                  {{ s.location }}
                </span>
              </div>
              <p v-if="s.note" class="text-[#735a3a] text-xs mt-1.5 italic">{{ s.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Guidelines -->
    <section class="py-20 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 class="text-[#1a3b4c] text-2xl font-semibold mb-10" style="font-family: 'Noto Serif', serif;">
          Persiapan Perayaan Ekaristi
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="g in guidelines" :key="g.title" class="bg-[#f4f3f2] rounded-2xl p-6">
            <div class="text-3xl mb-4">{{ g.icon }}</div>
            <h3 class="text-[#1a3b4c] font-semibold mb-2" style="font-family: 'Noto Serif', serif;">{{ g.title }}</h3>
            <p class="text-[#41484b] text-sm leading-relaxed">{{ g.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-[#1a3b4c]">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <h2 class="text-white text-3xl font-semibold mb-4" style="font-family: 'Noto Serif', serif;">
          Butuh Informasi Lebih Lanjut?
        </h2>
        <p class="text-white/60 mb-8">
          Hubungi sekretariat paroki untuk informasi jadwal khusus, sakramen, atau keperluan pastoral lainnya.
        </p>
        <a
          href="https://wa.me/6281321272634"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#1a3b4c] text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
        >
          WhatsApp Kami
        </a>
      </div>
    </section>
  </main>
</template>
