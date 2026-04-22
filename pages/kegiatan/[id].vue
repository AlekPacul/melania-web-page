<script setup lang="ts">
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

const route = useRoute()
const supabase = useSupabase()
const id = route.params.id as string

const { data: activity } = await useAsyncData(`kegiatan-${id}`, async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('id, title, description, activity_date, activity_time, location, category, image_url')
    .eq('id', id)
    .eq('is_published', true)
    .single()
  if (error) return null
  return data as Activity
})

if (!activity.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kegiatan tidak ditemukan' })
}

useHead({
  title: `${activity.value.title} — Paroki Santa Melania`,
  meta: [
    { name: 'description', content: activity.value.description?.slice(0, 160) ?? activity.value.title },
    ...(activity.value.image_url ? [{ property: 'og:image', content: activity.value.image_url }] : []),
  ],
})

const CAT_LABEL: Record<Category, string> = {
  pengumuman: 'Pengumuman',
  kegiatan:   'Kegiatan',
  liturgi:    'Liturgi',
  sosial:     'Sosial',
}

const CAT_ICON: Record<Category, string> = {
  pengumuman: 'i-lucide-megaphone',
  kegiatan:   'i-lucide-calendar-days',
  liturgi:    'i-lucide-church',
  sosial:     'i-lucide-users',
}

const CAT_COLORS: Record<Category, string> = {
  pengumuman: 'bg-blue-50 text-blue-700',
  kegiatan:   'bg-green-50 text-green-700',
  liturgi:    'bg-amber-50 text-amber-700',
  sosial:     'bg-purple-50 text-purple-700',
}

const CAT_BAR: Record<Category, string> = {
  pengumuman: 'bg-blue-500',
  kegiatan:   'bg-green-500',
  liturgi:    'bg-amber-500',
  sosial:     'bg-purple-500',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function fmtTime(t: string | null) {
  return t ? t.slice(0, 5) : null
}
</script>

<template>
  <main class="pt-16">
    <template v-if="activity">
      <!-- Hero image or color bar -->
      <div v-if="activity.image_url" class="relative h-72 lg:h-96 overflow-hidden">
        <img :src="activity.image_url" :alt="activity.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-8 max-w-4xl mx-auto">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm mb-3"
            :class="CAT_COLORS[activity.category]"
          >
            <UIcon :name="CAT_ICON[activity.category]" class="size-3" />
            {{ CAT_LABEL[activity.category] }}
          </span>
          <h1 class="text-white text-3xl lg:text-4xl font-semibold leading-tight" style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;">
            {{ activity.title }}
          </h1>
        </div>
      </div>
      <div v-else class="h-2" :class="CAT_BAR[activity.category]" />

      <!-- Content -->
      <section class="pt-12 pb-12 bg-[#faf9f8]">
        <div class="max-w-3xl mx-auto px-6 lg:px-12">

          <!-- Back -->
          <NuxtLink
            to="/kegiatan"
            class="inline-flex items-center gap-1.5 text-sm text-[#71787c] hover:text-[#1a3b4c] transition-colors mb-8"
          >
            <UIcon name="i-lucide-arrow-left" class="size-4" />
            Kembali ke Kegiatan
          </NuxtLink>

          <!-- Title (when no hero image) -->
          <template v-if="!activity.image_url">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4"
              :class="CAT_COLORS[activity.category]"
            >
              <UIcon :name="CAT_ICON[activity.category]" class="size-3" />
              {{ CAT_LABEL[activity.category] }}
            </span>
            <h1 class="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold leading-tight mb-6" style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;">
              {{ activity.title }}
            </h1>
          </template>

          <!-- Meta card -->
          <div class="bg-white rounded-2xl p-5 border border-[#e8e4df] space-y-3 mb-8">
            <div class="flex items-center gap-3 text-sm text-[#41484b]">
              <div class="w-8 h-8 rounded-lg bg-[#1a3b4c]/8 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-calendar" class="size-4 text-[#1a3b4c]" />
              </div>
              <span>{{ fmtDate(activity.activity_date) }}</span>
            </div>
            <div v-if="fmtTime(activity.activity_time)" class="flex items-center gap-3 text-sm text-[#41484b]">
              <div class="w-8 h-8 rounded-lg bg-[#1a3b4c]/8 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-clock" class="size-4 text-[#1a3b4c]" />
              </div>
              <span>Pukul {{ fmtTime(activity.activity_time) }}</span>
            </div>
            <div v-if="activity.location" class="flex items-center gap-3 text-sm text-[#41484b]">
              <div class="w-8 h-8 rounded-lg bg-[#1a3b4c]/8 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-map-pin" class="size-4 text-[#1a3b4c]" />
              </div>
              <span>{{ activity.location }}</span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="activity.description" class="prose prose-neutral max-w-none text-[#41484b] leading-relaxed whitespace-pre-line">
            {{ activity.description }}
          </div>
          <p v-else class="text-[#71787c] italic">Tidak ada deskripsi untuk kegiatan ini.</p>

          <!-- CTA -->
          <div class="mt-12 py-8 mb-16 border-t border-[#e8e4df] flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p class="text-[#41484b] text-sm">Ada pertanyaan mengenai kegiatan ini?</p>
            <a
              href="https://wa.me/6281321272634"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
            >
              <UIcon name="i-lucide-message-circle" class="size-4" />
              Hubungi via WhatsApp
            </a>
          </div>

        </div>
      </section>
    </template>
  </main>
</template>
