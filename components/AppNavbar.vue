<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/jadwal-misa', label: 'Jadwal Misa' },
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/pelayanan', label: 'Pelayanan' },
  { href: '/sakramen', label: 'Sakramen' },
  { href: '/struktur', label: 'Struktur' },
  { href: '/donasi', label: 'Donasi' },
]
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-[#c1c7cc]/30">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3">
        <img
          src="/assets/logo.jpg"
          alt="Logo Paroki Santa Melania"
          class="w-10 h-10 rounded-full object-cover"
        />
        <span class="text-[#1a3b4c] text-sm font-semibold leading-tight" style="font-family: 'Noto Serif', serif;">
          Santa Melania
        </span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="text-sm font-medium transition-colors"
          :class="route.path === link.href ? 'text-[#1a3b4c]' : 'text-[#41484b] hover:text-[#1a3b4c]'"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          to="/donasi"
          class="px-5 py-2 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
        >
          Persembahan
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
