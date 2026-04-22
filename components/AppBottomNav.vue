<script setup lang="ts">
const route = useRoute()

const links = [
  { href: '/', label: 'Beranda', icon: 'i-lucide-house' },
  { href: '/jadwal-misa', label: 'Jadwal', icon: 'i-lucide-calendar' },
  { href: '/kegiatan', label: 'Kegiatan', icon: 'i-lucide-activity' },
  { href: '/pelayanan', label: 'Pelayanan', icon: 'i-lucide-heart-handshake' },
  { href: '/donasi', label: 'Donasi', icon: 'i-lucide-heart' },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#faf9f8]/90 backdrop-blur-[16px] border-t border-[#c1c7cc]/30 pb-safe">
    <div class="flex items-center justify-around h-16 px-2">
      <NuxtLink
        v-for="link in links"
        :key="link.href"
        :to="link.href"
        class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors"
        :class="route.path === link.href ? 'text-[#1a3b4c]' : 'text-[#71787c]'"
      >
        <UIcon :name="link.icon" class="size-5" />
        <span class="text-[10px] font-medium">{{ link.label }}</span>
        <span
          v-if="route.path === link.href"
          class="absolute bottom-3 w-1 h-1 rounded-full bg-[#1a3b4c]"
        />
      </NuxtLink>
    </div>
  </nav>
</template>
