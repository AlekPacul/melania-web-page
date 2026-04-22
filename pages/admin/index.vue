<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

useHead({ title: 'Dashboard Admin — Paroki Santa Melania' })

const stats = [
  {
    label: 'Umat Terdaftar',
    value: '1.284',
    unit: 'Jiwa',
    icon: 'i-lucide-users',
    trend: '+12 bulan ini',
    trendUp: true,
  },
  {
    label: 'Pelayanan Aktif',
    value: '24',
    unit: 'Pelayanan',
    icon: 'i-lucide-heart-handshake',
    trend: '3 pelayanan baru',
    trendUp: true,
  },
  {
    label: 'Sukarelawan',
    value: '89',
    unit: 'Aktif',
    icon: 'i-lucide-hand',
    trend: 'Stabil bulan ini',
    trendUp: null,
  },
]

const activities = [
  {
    icon: 'i-lucide-calendar',
    category: 'Jadwal Misa',
    title: 'Jadwal Misa Pekan Suci diperbarui',
    desc: 'Misa Kamis Putih, Jumat Agung, dan Vigili Paskah telah ditambahkan ke kalender.',
    time: '2 jam lalu',
    action: 'Lihat Detail',
  },
  {
    icon: 'i-lucide-user-plus',
    category: 'Umat Baru',
    title: 'Pendaftaran umat baru — Komunitas St. Petrus',
    desc: 'Seorang umat baru mendaftar dan menunggu verifikasi keanggotaan.',
    time: '5 jam lalu',
    action: 'Verifikasi',
  },
  {
    icon: 'i-lucide-file-text',
    category: 'Keuangan',
    title: 'Laporan keuangan Maret siap ditinjau',
    desc: 'Laporan bulanan telah disiapkan untuk rapat dewan paroki.',
    time: 'Kemarin',
    action: 'Unduh Laporan',
  },
]

const upcomingEvents = [
  {
    date: '17',
    month: 'Apr',
    day: 'Kam',
    title: 'Misa Kamis Putih',
    time: '17:00 WIB',
    location: 'Gereja Utama',
    group: 'Tim Liturgi',
  },
  {
    date: '18',
    month: 'Apr',
    day: 'Jum',
    title: 'Jalan Salib & Misa Jumat Agung',
    time: '15:00 WIB',
    location: 'Gereja Utama',
    group: 'Tim Liturgi',
  },
  {
    date: '19',
    month: 'Apr',
    day: 'Sab',
    title: 'Vigili Paskah',
    time: '21:00 WIB',
    location: 'Gereja Utama',
    group: 'Tim Liturgi',
  },
  {
    date: '20',
    month: 'Apr',
    day: 'Min',
    title: 'Misa Paskah',
    time: '06:30 & 09:00 WIB',
    location: 'Gereja Utama',
    group: 'Tim Liturgi',
  },
]

const tasks = ref([
  { done: true,  label: 'Setujui Sertifikat Baptis (3 permohonan)' },
  { done: false, label: 'Perbarui warna liturgi di CMS untuk Paskah' },
  { done: false, label: 'Tinjau laporan keuangan bulan Maret' },
  { done: false, label: 'Konfirmasi jadwal pastor pengganti — 27 Apr' },
])

const completedCount = computed(() => tasks.value.filter(t => t.done).length)
const progressPct = computed(() => Math.round((completedCount.value / tasks.value.length) * 100))
</script>

<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

    <!-- ── Page title ──────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.15em] mb-1">
          Paroki Santa Melania
        </p>
        <h1 class="text-[#1a3b4c] text-2xl font-semibold" style="font-family: 'Noto Serif', serif;">
          Dashboard Admin
        </h1>
      </div>
      <UButton
        label="Tambah Jadwal"
        icon="i-lucide-plus"
        to="/admin/jadwal-misa/baru"
      />
    </div>

    <!-- ── Welcome banner ─────────────────────────────────── -->
    <div
      class="rounded-2xl px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style="background: linear-gradient(135deg, #1a3b4c 0%, #335264 100%);"
    >
      <div>
        <p class="text-white/60 text-xs font-semibold uppercase tracking-[0.15em] mb-1">
          Selamat datang kembali
        </p>
        <h2 class="text-white text-lg font-semibold" style="font-family: 'Noto Serif', serif;">
          Pekan Suci · April 2026
        </h2>
        <p class="text-white/60 text-sm mt-1">
          3 jadwal baru · 1 verifikasi menunggu · laporan Maret siap
        </p>
      </div>
      <UButton
        label="Kalender Liturgi"
        icon="i-lucide-calendar-days"
        variant="outline"
        class="border-white/30 text-white hover:bg-white/10 self-start sm:self-auto"
        to="/admin/jadwal-misa"
      />
    </div>

    <!-- ── Stats ──────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-2xl p-6 editorial-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-10 h-10 rounded-xl bg-[#f4f3f2] flex items-center justify-center">
            <UIcon :name="stat.icon" class="size-5 text-[#1a3b4c]" />
          </div>
          <UBadge
            v-if="stat.trendUp"
            label="↑"
            color="success"
            variant="subtle"
            size="sm"
          />
          <UBadge
            v-else-if="stat.trendUp === false"
            label="↓"
            color="error"
            variant="subtle"
            size="sm"
          />
        </div>
        <p class="text-[#41484b] text-xs font-medium uppercase tracking-wider mb-1">
          {{ stat.label }}
        </p>
        <div class="flex items-baseline gap-2">
          <span class="text-[#1a3b4c] text-3xl font-semibold" style="font-family: 'Noto Serif', serif;">
            {{ stat.value }}
          </span>
          <span class="text-[#71787c] text-sm">{{ stat.unit }}</span>
        </div>
        <p class="text-[#71787c] text-xs mt-2">{{ stat.trend }}</p>
      </div>
    </div>

    <!-- ── Middle grid: Activity + Tasks ──────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

      <!-- Aktivitas Terbaru (3/5) -->
      <div class="lg:col-span-3 bg-white rounded-2xl editorial-shadow">
        <div class="px-6 py-4 border-b border-[#f4f3f2] flex items-center justify-between">
          <h2 class="text-[#1a3b4c] font-semibold" style="font-family: 'Noto Serif', serif;">
            Aktivitas Terbaru
          </h2>
          <UButton label="Semua" color="neutral" variant="ghost" size="xs" />
        </div>
        <div class="divide-y divide-[#f4f3f2]">
          <div
            v-for="(act, i) in activities"
            :key="i"
            class="px-6 py-4 flex gap-4 hover:bg-[#faf9f8] transition-colors"
          >
            <div class="w-9 h-9 rounded-full bg-[#f4f3f2] flex items-center justify-center flex-shrink-0 mt-0.5">
              <UIcon :name="act.icon" class="size-4 text-[#1a3b4c]" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                <span class="text-xs font-semibold text-[#735a3a] uppercase tracking-wider">
                  {{ act.category }}
                </span>
                <span class="text-[#c1c7cc]">·</span>
                <span class="text-[#71787c] text-xs">{{ act.time }}</span>
              </div>
              <p class="text-[#1a3b4c] text-sm font-medium leading-snug">{{ act.title }}</p>
              <p class="text-[#41484b] text-xs mt-1 leading-relaxed">{{ act.desc }}</p>
              <button class="mt-2 text-xs text-[#1a3b4c] font-medium hover:underline">
                {{ act.action }} →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tugas Admin (2/5) -->
      <div class="lg:col-span-2 bg-white rounded-2xl editorial-shadow">
        <div class="px-6 py-4 border-b border-[#f4f3f2] flex items-center justify-between">
          <h2 class="text-[#1a3b4c] font-semibold" style="font-family: 'Noto Serif', serif;">
            Tugas Admin
          </h2>
          <UBadge :label="`${completedCount}/${tasks.length}`" color="neutral" variant="subtle" size="sm" />
        </div>

        <!-- Progress bar -->
        <div class="px-6 pt-4 pb-3">
          <div class="h-1.5 bg-[#f4f3f2] rounded-full overflow-hidden">
            <div
              class="h-full bg-[#1a3b4c] rounded-full transition-all duration-700"
              :style="{ width: `${progressPct}%` }"
            />
          </div>
          <p class="text-[#71787c] text-xs mt-1.5">{{ completedCount }} dari {{ tasks.length }} selesai</p>
        </div>

        <!-- Task list -->
        <div class="px-6 pb-4 space-y-3">
          <label
            v-for="(task, i) in tasks"
            :key="i"
            class="flex items-start gap-3 cursor-pointer"
          >
            <input
              v-model="task.done"
              type="checkbox"
              class="mt-0.5 w-4 h-4 rounded border-[#c1c7cc] accent-[#1a3b4c] flex-shrink-0"
            />
            <span
              class="text-sm leading-snug"
              :class="task.done ? 'text-[#71787c] line-through' : 'text-[#1a1c1c]'"
            >
              {{ task.label }}
            </span>
          </label>
        </div>

        <div class="px-6 pb-5">
          <UButton
            label="Tambah Tugas"
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            block
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- ── Upcoming Events ─────────────────────────────────── -->
    <div class="bg-white rounded-2xl editorial-shadow">
      <div class="px-6 py-4 border-b border-[#f4f3f2] flex items-center justify-between">
        <h2 class="text-[#1a3b4c] font-semibold" style="font-family: 'Noto Serif', serif;">
          Observansi Mendatang
        </h2>
        <UButton label="Kelola Jadwal" color="neutral" variant="ghost" size="xs" to="/admin/jadwal-misa" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#f4f3f2]">
        <div
          v-for="(event, i) in upcomingEvents"
          :key="i"
          class="px-6 py-5 hover:bg-[#faf9f8] transition-colors"
        >
          <div class="flex items-start gap-3 mb-3">
            <!-- Date badge -->
            <div class="bg-[#f4f3f2] rounded-xl px-3 py-1.5 text-center flex-shrink-0">
              <p class="text-[#735a3a] text-[10px] font-semibold uppercase">{{ event.day }}</p>
              <p class="text-[#1a3b4c] text-xl font-semibold leading-none" style="font-family: 'Noto Serif', serif;">
                {{ event.date }}
              </p>
              <p class="text-[#71787c] text-[10px]">{{ event.month }}</p>
            </div>
            <div class="flex-1 min-w-0 pt-0.5">
              <p class="text-[#1a1c1c] text-sm font-medium leading-snug">{{ event.title }}</p>
            </div>
          </div>

          <div class="space-y-1.5 pl-1">
            <div class="flex items-center gap-2 text-[#41484b] text-xs">
              <UIcon name="i-lucide-clock" class="size-3 flex-shrink-0 text-[#71787c]" />
              {{ event.time }}
            </div>
            <div class="flex items-center gap-2 text-[#41484b] text-xs">
              <UIcon name="i-lucide-map-pin" class="size-3 flex-shrink-0 text-[#71787c]" />
              {{ event.location }}
            </div>
            <div class="flex items-center gap-2 text-[#41484b] text-xs">
              <UIcon name="i-lucide-users" class="size-3 flex-shrink-0 text-[#71787c]" />
              {{ event.group }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Quick actions ──────────────────────────────────── -->
    <div>
      <h2 class="text-[#1a3b4c] font-semibold mb-4" style="font-family: 'Noto Serif', serif;">
        Aksi Cepat
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <NuxtLink
          v-for="action in [
            { icon: 'i-lucide-calendar-plus', label: 'Tambah Jadwal Misa',   to: '/admin/jadwal-misa' },
            { icon: 'i-lucide-user-plus',     label: 'Daftarkan Umat Baru',  to: '/admin/umat' },
            { icon: 'i-lucide-megaphone',     label: 'Buat Pengumuman',       to: '/admin/kegiatan' },
            { icon: 'i-lucide-download',      label: 'Unduh Laporan',         to: '/admin/laporan' },
          ]"
          :key="action.label"
          :to="action.to"
          class="bg-white rounded-2xl p-5 editorial-shadow hover:ambient-shadow transition-shadow flex flex-col items-center gap-3 text-center group"
        >
          <div class="w-10 h-10 rounded-xl bg-[#f4f3f2] group-hover:bg-[#1a3b4c]/10 flex items-center justify-center transition-colors">
            <UIcon :name="action.icon" class="size-5 text-[#1a3b4c]" />
          </div>
          <span class="text-[#1a1c1c] text-xs font-medium leading-snug">{{ action.label }}</span>
        </NuxtLink>
      </div>
    </div>

  </div>
</template>
