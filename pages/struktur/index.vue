<script setup lang="ts">
useHead({
  title: 'Struktur Organisasi — Paroki Santa Melania Bandung',
  meta: [
    { name: 'description', content: 'Struktur organisasi dan kepengurusan Paroki Santa Melania Bandung.' },
  ],
})

const supabase = useSupabase()
const { getCachedData, markFetched } = usePageCache()

interface Member {
  id: string
  name: string
  title: string
  photo_url: string | null
  sort_order: number
}

interface Group {
  id: string
  name: string
  description: string | null
  sort_order: number
  parish_members: Member[]
}

const { data: groups, error } = await useAsyncData('parish-struktur', async () => {
  const { data, error } = await supabase
    .from('parish_groups')
    .select('id, name, description, sort_order, parish_members(id, name, title, photo_url, sort_order)')
    .eq('is_active', true)
    .eq('parish_members.is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data as Group[]).map(g => ({
    ...g,
    parish_members: [...g.parish_members].sort((a, b) => a.sort_order - b.sort_order),
  }))
}, { getCachedData: (key) => getCachedData(key) })

if (!error.value) markFetched('parish-struktur')

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
</script>

<template>
  <main class="pt-16">
    <!-- Hero -->
    <section class="bg-[#f4f3f2] py-20">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Paroki</p>
        <h1
          class="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mb-4"
          style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
        >
          Struktur Organisasi
        </h1>
        <p class="text-[#41484b] max-w-xl text-lg leading-relaxed">
          Kepengurusan dan pelayanan Paroki Santa Melania Bandung.
        </p>
      </div>
    </section>

    <!-- Error -->
    <section v-if="error" class="py-20 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
          <UIcon name="i-lucide-alert-circle" class="size-5 flex-shrink-0" />
          <p>Gagal memuat data struktur. Silakan coba beberapa saat lagi.</p>
        </div>
      </div>
    </section>

    <!-- Empty -->
    <section v-else-if="!groups?.length" class="py-32 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <UIcon name="i-lucide-users" class="size-12 text-[#c1c7cc] mx-auto mb-4" />
        <p class="text-[#71787c]">Data struktur organisasi belum tersedia.</p>
      </div>
    </section>

    <!-- Groups -->
    <section v-else class="py-20 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        <div v-for="group in groups" :key="group.id">
          <!-- Group header -->
          <div class="mb-8">
            <h2
              class="text-[#1a3b4c] text-2xl font-semibold"
              style="font-family: 'Noto Serif', serif;"
            >
              {{ group.name }}
            </h2>
            <p v-if="group.description" class="text-[#71787c] mt-1 text-sm max-w-xl">
              {{ group.description }}
            </p>
            <div class="mt-3 h-px bg-[#e8e4df]" />
          </div>

          <!-- Members grid -->
          <div
            v-if="group.parish_members.length"
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            <div
              v-for="member in group.parish_members"
              :key="member.id"
              class="bg-white rounded-2xl p-5 text-center editorial-shadow"
            >
              <!-- Photo or initials avatar -->
              <div class="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden bg-[#1a3b4c]/10 flex items-center justify-center">
                <img
                  v-if="member.photo_url"
                  :src="member.photo_url"
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-[#1a3b4c] text-xl font-semibold" style="font-family: 'Noto Serif', serif;">
                  {{ initials(member.name) }}
                </span>
              </div>
              <p class="text-[#1a3b4c] font-semibold text-sm leading-snug" style="font-family: 'Noto Serif', serif;">
                {{ member.name }}
              </p>
              <p class="text-[#735a3a] text-xs mt-1">{{ member.title }}</p>
            </div>
          </div>

          <p v-else class="text-[#71787c] text-sm italic">Belum ada anggota terdaftar.</p>
        </div>
      </div>
    </section>
  </main>
</template>
