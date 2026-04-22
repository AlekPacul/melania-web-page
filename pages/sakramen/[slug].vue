<script setup lang="ts">
const route = useRoute()
const { getAll, getBySlug } = useSakramen()

const slug = route.params.slug as string
const sakramen = getBySlug(slug)

if (!sakramen) {
  throw createError({ statusCode: 404, statusMessage: 'Halaman tidak ditemukan' })
}

useHead({
  title: `Sakramen ${sakramen.title} — Paroki Santa Melania Bandung`,
  meta: [
    { name: 'description', content: sakramen.description },
  ],
})

const allSakramen = getAll().filter(s => s.slug !== slug)
</script>

<template>
  <main class="pt-16">
    <!-- Hero -->
    <section class="bg-[#f4f3f2] py-16">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-[#8a9196] mb-8">
          <NuxtLink to="/" class="hover:text-[#1a3b4c] transition-colors">Beranda</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5" />
          <NuxtLink to="/sakramen" class="hover:text-[#1a3b4c] transition-colors">Sakramen</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="w-3.5 h-3.5" />
          <span class="text-[#41484b]">{{ sakramen.title }}</span>
        </nav>

        <div class="flex items-start gap-5">
          <div :class="['w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center', sakramen.colorBadge]">
            <UIcon :name="sakramen.icon" :class="['w-7 h-7', sakramen.colorIcon]" />
          </div>
          <div>
            <span :class="['text-xs font-semibold uppercase tracking-[0.18em]', sakramen.colorIcon]">
              {{ sakramen.subtitle }}
            </span>
            <h1
              class="text-[#1a3b4c] text-4xl lg:text-5xl font-semibold leading-tight mt-1 mb-4"
              style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
            >
              Sakramen {{ sakramen.title }}
            </h1>
            <p class="text-[#41484b] text-lg leading-relaxed max-w-3xl">{{ sakramen.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <div :class="['h-1.5 w-full', sakramen.colorBar]" />

    <!-- Content -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-12">
        <!-- Main -->
        <div class="lg:col-span-2 space-y-10">
          <!-- Requirements -->
          <div
            v-for="(group, i) in sakramen.requirements"
            :key="i"
          >
            <h2
              class="text-[#1a3b4c] text-xl font-semibold mb-4 flex items-center gap-2"
              style="font-family: 'Noto Serif', serif;"
            >
              <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 text-[#735a3a] flex-shrink-0" />
              {{ group.label === 'Persyaratan' || group.label === 'Persiapan' || group.label === 'Siapa yang Dapat Menerimanya'
                  ? group.label
                  : `Persyaratan — ${group.label}` }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(item, j) in group.items"
                :key="j"
                class="flex items-start gap-3 text-[#41484b]"
              >
                <UIcon name="i-lucide-check-circle-2" :class="['w-5 h-5 flex-shrink-0 mt-0.5', sakramen.colorIcon]" />
                <span class="text-sm leading-relaxed">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Process -->
          <div>
            <h2
              class="text-[#1a3b4c] text-xl font-semibold mb-4 flex items-center gap-2"
              style="font-family: 'Noto Serif', serif;"
            >
              <UIcon name="i-lucide-list-ordered" class="w-5 h-5 text-[#735a3a] flex-shrink-0" />
              Alur Pendaftaran
            </h2>
            <ol class="space-y-4">
              <li
                v-for="(step, i) in sakramen.process"
                :key="i"
                class="flex items-start gap-4"
              >
                <span
                  :class="['w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5', sakramen.colorBar]"
                >
                  {{ i + 1 }}
                </span>
                <span class="text-[#41484b] text-sm leading-relaxed pt-1">{{ step }}</span>
              </li>
            </ol>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-5">
          <!-- Contact card -->
          <div class="bg-[#f4f3f2] rounded-2xl p-6">
            <h3
              class="text-[#1a3b4c] text-base font-semibold mb-3 flex items-center gap-2"
              style="font-family: 'Noto Serif', serif;"
            >
              <UIcon name="i-lucide-info" class="w-4 h-4 text-[#735a3a]" />
              Informasi Kontak
            </h3>
            <p class="text-[#41484b] text-sm leading-relaxed mb-5">{{ sakramen.contact }}</p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#1a3b4c] text-white text-sm font-medium rounded-xl hover:bg-[#335264] transition-colors"
            >
              <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
              Hubungi via WhatsApp
            </a>
          </div>

          <!-- Note -->
          <div v-if="sakramen.note" class="border border-amber-200 bg-amber-50 rounded-2xl p-5">
            <div class="flex items-start gap-2">
              <UIcon name="i-lucide-triangle-alert" class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p class="text-amber-800 text-sm leading-relaxed">{{ sakramen.note }}</p>
            </div>
          </div>

          <!-- Back link -->
          <NuxtLink
            to="/sakramen"
            class="flex items-center gap-2 text-[#1a3b4c] text-sm font-medium hover:text-[#335264] transition-colors"
          >
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            Lihat semua sakramen
          </NuxtLink>
        </aside>
      </div>
    </section>

    <!-- Other Sacraments -->
    <section class="py-14 bg-[#f4f3f2]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <h2
          class="text-[#1a3b4c] text-xl font-semibold mb-6"
          style="font-family: 'Noto Serif', serif;"
        >
          Sakramen Lainnya
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <NuxtLink
            v-for="s in allSakramen"
            :key="s.slug"
            :to="`/sakramen/${s.slug}`"
            class="group bg-white rounded-xl p-4 border border-[#e8e4e0] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center mb-3', s.colorBadge]">
              <UIcon :name="s.icon" :class="['w-4 h-4', s.colorIcon]" />
            </div>
            <p class="text-[#1a3b4c] text-sm font-semibold group-hover:text-[#335264] transition-colors">
              {{ s.title }}
            </p>
            <p class="text-[#8a9196] text-xs mt-0.5">{{ s.subtitle }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
