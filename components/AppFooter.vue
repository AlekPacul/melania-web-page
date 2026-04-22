<template>
  <footer class="bg-[#1a3b4c] text-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- About -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <img src="/assets/logo.jpg" alt="Logo Paroki Santa Melania" class="w-10 h-10 rounded-full object-cover" />
            <h3 class="text-white font-semibold" style="font-family: 'Noto Serif', serif;">
              Gereja Katolik Santa Melania
            </h3>
          </div>
          <p class="text-white/60 text-sm leading-relaxed max-w-sm">
            Melayani umat Bandung sejak 1954. Paroki Santa Melania hadir sebagai rumah iman
            bagi setiap pencari makna dalam tradisi Katolik.
          </p>
          <a
            href="https://wa.me/6281321272634"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-[#25d366]/20 hover:bg-[#25d366]/30 text-white text-sm rounded-full transition-colors"
          >
            <UIcon name="i-simple-icons-whatsapp" class="size-4 text-[#25d366]" />
            WhatsApp Kami
          </a>
        </div>

        <!-- Menu -->
        <div>
          <h4 class="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">Menu</h4>
          <ul class="space-y-3">
            <li v-for="link in [{ href: '/', label: 'Beranda' }, { href: '/jadwal-misa', label: 'Jadwal Misa' }, { href: '/donasi', label: 'Donasi' }]" :key="link.href">
              <NuxtLink :to="link.href" class="text-white/60 hover:text-white text-sm transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Location -->
        <div>
          <h4 class="text-white/80 text-xs font-semibold uppercase tracking-widest mb-4">Lokasi</h4>
          <address class="not-italic text-white/60 text-sm leading-relaxed">
            Jl. Melania No.1-3<br />
            Cihaur Geulis, Kec. Cibeunying Kaler<br />
            Kota Bandung, Jawa Barat 40122
          </address>
          <a
            href="https://maps.app.goo.gl/tCd5SKadPSv4bLAS8"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block mt-3 text-white/40 hover:text-white/70 text-xs transition-colors underline"
          >
            Buka di Google Maps →
          </a>
        </div>
      </div>

      <div class="border-t border-white/10 mt-12 pt-6 text-center">
        <p class="text-white/40 text-xs">
          © {{ new Date().getFullYear() }} Gereja Katolik Santa Melania. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
