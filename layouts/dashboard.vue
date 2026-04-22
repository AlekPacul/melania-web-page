<script setup lang="ts">
const route = useRoute()
const mobileOpen = ref(false)
const { profile, signOut } = useAuth()

interface NavItem { label: string; icon: string; to: string }

const navMain = computed<NavItem[]>(() => [
  { label: 'Dashboard',      icon: 'i-lucide-layout-dashboard', to: '/admin' },
  { label: 'Jadwal Misa',    icon: 'i-lucide-calendar',         to: '/admin/jadwal-misa' },
  { label: 'Kegiatan',       icon: 'i-lucide-activity',         to: '/admin/kegiatan' },
  { label: 'Pelayanan',      icon: 'i-lucide-heart-handshake',  to: '/admin/pelayanan' },
  { label: 'Umat & Paroki',  icon: 'i-lucide-users',            to: '/admin/umat' },
  { label: 'Struktur',       icon: 'i-lucide-network',          to: '/admin/struktur' },
  { label: 'Donasi',         icon: 'i-lucide-heart-handshake',  to: '/admin/donasi' },
])

const navBottom = computed<NavItem[]>(() => [
  { label: 'Pengaturan', icon: 'i-lucide-settings', to: '/admin/pengaturan' },
])

// Initials for avatar (from name or email)
const initials = computed(() => {
  const src = profile.value?.name ?? profile.value?.email ?? ''
  return src
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
    || 'A'
})

async function handleSignOut() {
  await signOut()
  await navigateTo('/login')
}

// Close mobile drawer on route change
watch(() => route.path, () => { mobileOpen.value = false })
</script>

<template>
  <div class="flex h-screen bg-[#faf9f8] overflow-hidden">

    <!-- ── Mobile overlay ─────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-30 bg-black/30 lg:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- ── Sidebar ─────────────────────────────────────────── -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-[#f4f3f2] transition-transform duration-300 lg:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="h-16 px-5 flex items-center gap-3 border-b border-[#f4f3f2] flex-shrink-0">
        <img src="/assets/logo.jpg" alt="Logo" class="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        <span class="text-[#1a3b4c] text-sm font-semibold leading-tight" style="font-family: 'Noto Serif', serif;">
          Santa Melania
        </span>
      </div>

      <!-- Main nav -->
      <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        <NuxtLink
          v-for="item in navMain"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group"
          :class="route.path === item.to
            ? 'bg-[#1a3b4c] text-white'
            : 'text-[#41484b] hover:bg-[#f4f3f2] hover:text-[#1a3b4c]'"
          exact-active-class=""
        >
          <UIcon :name="item.icon" class="size-4 flex-shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Bottom nav -->
      <div class="px-3 py-3 border-t border-[#f4f3f2] space-y-0.5">
        <NuxtLink
          v-for="item in navBottom"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#41484b] hover:bg-[#f4f3f2] hover:text-[#1a3b4c] transition-colors"
        >
          <UIcon :name="item.icon" class="size-4 flex-shrink-0" />
          {{ item.label }}
        </NuxtLink>
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#41484b] hover:bg-red-50 hover:text-red-600 transition-colors"
          @click="handleSignOut"
        >
          <UIcon name="i-lucide-log-out" class="size-4 flex-shrink-0" />
          Keluar
        </button>
      </div>
    </aside>

    <!-- ── Main content ────────────────────────────────────── -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">

      <!-- Topbar -->
      <header class="h-16 px-4 lg:px-6 flex items-center justify-between bg-white border-b border-[#f4f3f2] flex-shrink-0">
        <!-- Mobile hamburger -->
        <button
          class="lg:hidden p-2 rounded-lg text-[#41484b] hover:bg-[#f4f3f2] transition-colors"
          @click="mobileOpen = true"
        >
          <UIcon name="i-lucide-menu" class="size-5" />
        </button>

        <!-- Page title (filled by child via provide/inject or just left empty) -->
        <div class="hidden lg:block" />

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-bell"
            color="neutral"
            variant="ghost"
            aria-label="Notifikasi"
            size="sm"
          />
          <!-- User avatar + email tooltip -->
          <div
            class="flex items-center gap-2 pl-1"
            :title="profile?.email ?? ''"
          >
            <div class="w-8 h-8 rounded-full bg-[#1a3b4c] flex items-center justify-center text-white text-xs font-semibold select-none">
              {{ initials }}
            </div>
            <span class="hidden lg:block text-sm text-[#41484b] max-w-[140px] truncate">
              {{ profile?.name ?? profile?.email ?? '' }}
            </span>
          </div>
        </div>
      </header>

      <!-- Scrollable page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
