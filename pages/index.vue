<script setup lang="ts">
useHead({
  title: 'Beranda — Paroki Santa Melania Bandung',
  meta: [
    { name: 'description', content: 'Selamat datang di Paroki Katolik Santa Melania Bandung. Melayani umat sejak 1954 di Jl. Melania No.1-3, Cihaur Geulis, Kota Bandung, Jawa Barat.' },
  ],
})

useSeoMeta({
  ogTitle: 'Paroki Santa Melania Bandung',
  ogDescription: 'Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954.',
  ogImage: 'https://paroki-melania-dev.my.id/assets/hero.jpg',
  ogType: 'website',
  ogUrl: 'https://paroki-melania-dev.my.id',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Paroki Santa Melania Bandung',
  twitterDescription: 'Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954.',
  twitterImage: 'https://paroki-melania-dev.my.id/assets/hero.jpg',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Church',
        name: 'Paroki Santa Melania Bandung',
        alternateName: 'Gereja Santa Melania',
        url: 'https://paroki-melania-dev.my.id',
        logo: 'https://paroki-melania-dev.my.id/assets/logo.jpg',
        image: 'https://paroki-melania-dev.my.id/assets/hero.jpg',
        description: 'Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954 di Jl. Melania No.1-3, Cihaur Geulis, Kota Bandung, Jawa Barat.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jl. Melania No.1-3, Cihaur Geulis',
          addressLocality: 'Bandung',
          addressRegion: 'Jawa Barat',
          postalCode: '40123',
          addressCountry: 'ID',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -6.9034,
          longitude: 107.6186,
        },
        telephone: '+6281321272634',
        openingHours: ['Sa 17:00-18:00', 'Su 06:30-07:30', 'Su 09:00-10:00'],
        sameAs: [
          'https://www.instagram.com/omkstmelania/',
        ],
      }),
    },
  ],
})

const supabase = useSupabase()
const { getCachedData, markFetched } = usePageCache()

// Fetch a compact preview for the hero quick-info card (Jumat–Minggu only)
const { data: heroSchedule } = await useAsyncData('hero-schedule', async () => {
  const { data } = await supabase
    .from('mass_schedules')
    .select('day_label, mass_time, mass_type, note')
    .eq('is_active', true)
    .in('day_label', ['Jumat', 'Sabtu', 'Minggu'])
    .order('sort_order', { ascending: true })
  markFetched('hero-schedule')
  return data ?? []
}, { getCachedData: (key) => getCachedData(key) })

const ministries = [
  {
    icon: '🕯️',
    tag: 'Liturgi Utama',
    title: 'Perayaan Ekaristi Kudus',
    desc: 'Jadwal Misa harian dan mingguan. Sabtu 17:00, Minggu 06:30 & 09:00, serta Misa Jumat Pertama setiap awal bulan.',
    link: '/jadwal-misa',
    linkLabel: 'Lihat Jadwal Misa',
    image: '/assets/hero.jpg',
    external: false,
  },
  {
    icon: '📖',
    tag: 'Pembinaan Iman',
    title: 'Katekese',
    desc: 'Pendalaman iman dan kelas katekumen dewasa untuk mempersiapkan diri menerima sakramen.',
    link: 'https://wa.me/6281321272634',
    linkLabel: 'Hubungi via WhatsApp',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSVrUEVdcs4vFkBfWbR3xfKB9DLy-HdFEM3qLuvHakdYK3pQwsVwUbL7Ntmvo8tmQ9uNjNpz8qEVt-f4Ay7RbdEkSF-I-GP05kaXzU9aW9lh_DtUFrh0hZlImVE_G4APqZvJudD4wPoMnc_RCqX6AtMsQS3LKDCqfCnOMpo8nT5fbqjFHnxexKN8-p5t4ruZGIum7LwDXUk42KL-vKwmmDIGlP0O_0ZbuF_LsCS5lpPYVANqfZy1ZDpgHzhogIg3vKdFbfXppXTVZG',
    external: true,
  },
  {
    icon: '✨',
    tag: 'Orang Muda',
    title: 'OMK St. Melania',
    desc: 'Wadah kreativitas dan pertumbuhan iman orang muda Katolik yang dinamis dan penuh semangat.',
    link: 'https://www.instagram.com/omkstmelania/',
    linkLabel: 'Ikuti di Instagram',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSVrUEVdcs4vFkBfWbR3xfKB9DLy-HdFEM3qLuvHakdYK3pQwsVwUbL7Ntmvo8tmQ9uNjNpz8qEVt-f4Ay7RbdEkSF-I-GP05kaXzU9aW9lh_DtUFrh0hZlImVE_G4APqZvJudD4wPoMnc_RCqX6AtMsQS3LKDCqfCnOMpo8nT5fbqjFHnxexKN8-p5t4ruZGIum7LwDXUk42KL-vKwmmDIGlP0O_0ZbuF_LsCS5lpPYVANqfZy1ZDpgHzhogIg3vKdFbfXppXTVZG',
    external: true,
  },
]

const reflections = [
  {
    date: '24 MEI 2024',
    datetime: '2024-05-24',
    title: 'Menemukan Hening di Tengah Bisingnya Kota',
    excerpt: 'Dalam setiap tarikan napas, ada kesempatan untuk kembali kepada-Nya. Gereja hadir sebagai ruang pernafasan spiritual di tengah kepenatan dunia.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSVrUEVdcs4vFkBfWbR3xfKB9DLy-HdFEM3qLuvHakdYK3pQwsVwUbL7Ntmvo8tmQ9uNjNpz8qEVt-f4Ay7RbdEkSF-I-GP05kaXzU9aW9lh_DtUFrh0hZlImVE_G4APqZvJudD4wPoMnc_RCqX6AtMsQS3LKDCqfCnOMpo8nT5fbqjFHnxexKN8-p5t4ruZGIum7LwDXUk42KL-vKwmmDIGlP0O_0ZbuF_LsCS5lpPYVANqfZy1ZDpgHzhogIg3vKdFbfXppXTVZG',
  },
  {
    date: '23 MEI 2024',
    datetime: '2024-05-23',
    title: 'Kekuatan Dalam Kerendahan Hati',
    excerpt: 'Kerendahan hati bukan kelemahan, melainkan kekuatan yang tersembunyi di balik kesederhanaan yang tulus.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2lR4kbFlmfP-AqwgwIqS89qGcMZe1b1jbM-4W2TMvnuo7vV9jrTNs_RAJ5SJciqKiZcrkCZJol3iMLGdCwLgj64z8911MuVViD-pS1CB-BLWIeUBZsBb01xGlJ0tRrR9YPmsK_MBHdCGNItVf6U-WAwX2dPQes3lBsOKNF9vUvRla2jUbesm2IpFf3c3BWZjUdKn3_wObSMducq4Jof4xJze_AguSEXg9rTXjS8PleXQ59QHl8daIWb-AMDeQeUpuWzQj7RK3009',
  },
  {
    date: '22 MEI 2024',
    datetime: '2024-05-22',
    title: 'Melayani Dengan Sukacita',
    excerpt: 'Setiap tindakan kasih adalah doa yang hidup. Pelayanan sejati lahir bukan dari kewajiban, melainkan dari cinta.',
    image: null,
  },
]

const milestones = [
  { year: '1954', desc: 'Sekitar 15 umat Katolik di sekitar Gedung Sate mulai berdoa bersama' },
  { year: '1956', desc: 'Perayaan Ekaristi pertama di kelas Sekolah Rakyat, Paroki dibawah Katedral St. Petrus' },
  { year: '1978', desc: 'Diresmikan sebagai Paroki mandiri oleh Pastor Ignasius Wibisono OSC' },
  { year: '1980', desc: 'Gedung gereja saat ini diberkati oleh Uskup Arnts' },
  { year: '2018', desc: 'Pastor Bernardus Jumiyana memimpin, membawa berbagai inisiatif pengembangan' },
]
</script>

<template>
  <main class="pt-16">
    <!-- Hero -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden">
      <div class="absolute inset-0">
        <img src="/assets/hero.jpg" alt="Gereja Katolik Santa Melania Bandung" class="w-full h-full object-cover" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#faf9f8]/95 via-[#faf9f8]/75 to-[#faf9f8]/20" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#faf9f8]/60 via-transparent to-transparent" />

      <div class="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-6">
            Paroki Katolik · Bandung
          </p>
          <h1
            class="text-[#1a3b4c] text-4xl lg:text-6xl font-semibold leading-tight tracking-tight mb-6"
            style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
          >
            Paroki<br />
            <em class="font-normal">Santa Melania</em>
          </h1>
          <p class="text-[#41484b] text-lg leading-relaxed mb-10 max-w-md">
            Melayani umat Bandung sejak 1954. Sebuah rumah iman yang merayakan tradisi
            Katolik melalui persekutuan dan pelayanan yang hidup.
          </p>
          <div class="flex flex-wrap gap-4">
            <NuxtLink
              to="/jadwal-misa"
              class="px-8 py-3.5 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
            >
              Lihat Jadwal Misa
            </NuxtLink>
            <NuxtLink
              to="/donasi"
              class="px-8 py-3.5 text-[#1a3b4c] text-sm font-medium rounded-full border border-[#1a3b4c]/30 hover:bg-[#1a3b4c]/5 transition-colors"
            >
              Persembahan
            </NuxtLink>
          </div>
        </div>

        <!-- Quick Info Card -->
        <div class="hidden lg:block">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 editorial-shadow">
            <h3 class="text-[#1a3b4c] font-semibold mb-6" style="font-family: 'Noto Serif', serif;">
              Jadwal Misa Minggu Ini
            </h3>
            <div class="space-y-4">
              <div
                v-for="m in heroSchedule"
                :key="m.mass_type"
                class="flex items-center justify-between py-2"
              >
                <div class="flex items-center gap-3">
                  <span class="text-xs text-[#41484b] w-14 truncate">{{ m.day_label }}</span>
                  <span class="text-[#1a3b4c] font-semibold text-lg" style="font-family: 'Noto Serif', serif;">
                    {{ m.mass_time.slice(0, 5) }}
                  </span>
                </div>
                <span class="text-xs text-[#735a3a] font-medium truncate max-w-[110px]">{{ m.mass_type }}</span>
              </div>
            </div>
            <p v-if="heroSchedule?.some(m => m.note)" class="text-[#71787c] text-xs mt-4">
              * {{ heroSchedule?.find(m => m.note)?.note }}
            </p>
            <NuxtLink to="/jadwal-misa" class="mt-3 block text-center text-sm text-[#1a3b4c] font-medium hover:underline">
              Jadwal lengkap →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- About / History -->
    <section class="bg-[#f4f3f2] py-24">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-start">
        <div class="relative">
          <img
            src="/assets/panti-imam.jpg"
            alt="Panti Imam Gereja Santa Melania"
            class="w-full h-72 lg:h-96 object-cover rounded-2xl"
          />
          <div class="mt-8 space-y-4">
            <div v-for="(m, i) in milestones" :key="m.year" class="flex gap-4">
              <div class="flex flex-col items-center">
                <div class="w-2 h-2 rounded-full bg-[#735a3a] mt-1.5 flex-shrink-0" />
                <div v-if="i < milestones.length - 1" class="w-px flex-1 bg-[#c1c7cc] mt-1" />
              </div>
              <div class="pb-4">
                <span class="text-[#1a3b4c] text-sm font-semibold" style="font-family: 'Noto Serif', serif;">
                  {{ m.year }}
                </span>
                <p class="text-[#41484b] text-sm leading-relaxed">{{ m.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:pt-4">
          <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Sejarah Paroki</p>
          <h2
            class="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold leading-tight mb-6"
            style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;"
          >
            Tujuh Dekade<br />Melayani Umat Bandung
          </h2>
          <p class="text-[#41484b] leading-relaxed mb-5">
            Paroki Santa Melania berakar dari sekitar 15 umat Katolik di sekitar Gedung Sate yang mulai berdoa bersama
            di sebuah ruang kelas SPG Citarum pada tahun 1954.
          </p>
          <p class="text-[#41484b] leading-relaxed mb-5">
            Pada tahun 1956, perayaan Ekaristi pertama diselenggarakan di kelas Sekolah Rakyat. Pertumbuhan jemaat
            yang pesat menjadikan stasi ini diakui resmi sebagai "Stasi St. Melania" di bawah Paroki Katedral St. Petrus.
          </p>
          <blockquote class="border-l-4 border-[#735a3a] pl-5 my-8">
            <p class="text-[#1a3b4c] text-lg italic leading-relaxed" style="font-family: 'Noto Serif', serif;">
              "Di mana dua atau tiga orang berkumpul dalam nama-Ku, di situ Aku ada di tengah-tengah mereka."
            </p>
            <cite class="text-[#41484b] text-sm mt-2 block not-italic">— Matius 18:20</cite>
          </blockquote>
          <p class="text-[#41484b] leading-relaxed">
            Pada tahun 1978, di bawah kepemimpinan Pastor Ignasius Wibisono OSC, stasi ini resmi ditingkatkan menjadi
            paroki mandiri. Gedung gereja yang ada saat ini diberkati oleh Uskup Arnts pada tahun 1980.
          </p>
        </div>
      </div>
    </section>

    <!-- Scripture -->
    <section class="bg-[#1a3b4c] py-20">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <div class="w-8 h-1 bg-[#735a3a] mx-auto mb-8 rounded-full" />
        <blockquote class="text-white text-2xl lg:text-3xl font-normal leading-relaxed italic" style="font-family: 'Noto Serif', serif;">
          "Datanglah kepada-Ku, semua yang lelah dan berbeban berat, Aku akan memberi kelegaan kepadamu."
        </blockquote>
        <cite class="text-white/50 text-sm mt-6 block not-italic">— Matius 11:28</cite>
      </div>
    </section>

    <!-- Ministries -->
    <section class="py-24 bg-[#f4f3f2]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-14">
          <div>
            <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Kehidupan Paroki</p>
            <h2 class="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold" style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;">
              Eksplorasi Pelayanan
            </h2>
          </div>
          <a href="#" class="text-sm text-[#1a3b4c] font-medium hover:underline">Lihat Semua Pelayanan →</a>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="m in ministries"
            :key="m.title"
            class="bg-white rounded-2xl overflow-hidden editorial-shadow hover:ambient-shadow transition-shadow group"
          >
            <div class="h-44 overflow-hidden">
              <img :src="m.image" :alt="m.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div class="p-5">
              <span class="text-xs text-[#735a3a] font-semibold uppercase tracking-wider">{{ m.tag }}</span>
              <h3 class="text-[#1a3b4c] font-semibold mt-1 mb-2" style="font-family: 'Noto Serif', serif;">{{ m.title }}</h3>
              <p class="text-[#41484b] text-sm leading-relaxed mb-4">{{ m.desc }}</p>
              <a
                v-if="m.external"
                :href="m.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-[#1a3b4c] font-medium hover:underline"
              >
                {{ m.linkLabel }} →
              </a>
              <NuxtLink v-else :to="m.link" class="text-sm text-[#1a3b4c] font-medium hover:underline">
                {{ m.linkLabel }} →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Daily Reflections -->
    <section class="py-24 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-14">
          <div>
            <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Bacaan & Renungan</p>
            <h2 class="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold" style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;">
              Refleksi Harian
            </h2>
          </div>
          <a href="#" class="text-sm text-[#1a3b4c] font-medium hover:underline">Semua Refleksi →</a>
        </div>
        <div class="grid lg:grid-cols-3 gap-6">
          <article v-for="r in reflections" :key="r.datetime" class="bg-white rounded-2xl overflow-hidden editorial-shadow">
            <div v-if="r.image" class="h-48 overflow-hidden">
              <img :src="r.image" :alt="r.title" class="w-full h-full object-cover" />
            </div>
            <div class="p-6">
              <time :datetime="r.datetime" class="text-xs text-[#735a3a] font-semibold uppercase tracking-wider">
                {{ r.date }}
              </time>
              <h3 class="text-[#1a3b4c] font-semibold mt-2 mb-3 leading-snug" style="font-family: 'Noto Serif', serif;">
                {{ r.title }}
              </h3>
              <p class="text-[#41484b] text-sm leading-relaxed">{{ r.excerpt }}</p>
              <a href="#" class="mt-4 inline-block text-sm text-[#1a3b4c] font-medium hover:underline">Baca Selengkapnya →</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Location -->
    <section class="py-24 bg-[#faf9f8]">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p class="text-[#735a3a] text-xs font-semibold uppercase tracking-[0.2em] mb-4">Kunjungi Kami</p>
            <h2 class="text-[#1a3b4c] text-3xl lg:text-4xl font-semibold mb-6" style="font-family: 'Noto Serif', serif; letter-spacing: -0.02em;">
              Lokasi Gereja
            </h2>
            <div class="bg-[#f4f3f2] rounded-2xl p-6 mb-6">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-[#1a3b4c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-lg">📍</span>
                </div>
                <div>
                  <h3 class="text-[#1a3b4c] font-semibold mb-1" style="font-family: 'Noto Serif', serif;">Paroki Santa Melania</h3>
                  <address class="not-italic text-[#41484b] text-sm leading-relaxed">
                    Jl. Melania No.1-3<br />
                    Cihaur Geulis, Kec. Cibeunying Kaler<br />
                    Kota Bandung, Jawa Barat 40122
                  </address>
                </div>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/tCd5SKadPSv4bLAS8"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#1a3b4c] text-white text-sm font-medium rounded-full hover:bg-[#335264] transition-colors"
            >
              <span>🗺️</span>
              Buka di Google Maps
            </a>
          </div>

          <div class="rounded-2xl overflow-hidden editorial-shadow h-80 lg:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8!2d107.625!3d-6.899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6f3b9e9e9e9%3A0x0!2sJl.+Melania+No.1-3!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style="border: 0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Lokasi Gereja Katolik Santa Melania"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
