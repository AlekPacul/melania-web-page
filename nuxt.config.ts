// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/sitemap'],

  site: {
    url: 'https://paroki-melania-dev.my.id',
    name: 'Paroki Santa Melania Bandung',
  },

  sitemap: {
    strictNuxtContentPaths: false,
    urls: [
      { loc: '/', priority: 1.0, changefreq: 'weekly' },
      { loc: '/jadwal-misa', priority: 0.9, changefreq: 'weekly' },
      { loc: '/kegiatan', priority: 0.8, changefreq: 'daily' },
      { loc: '/pelayanan', priority: 0.8, changefreq: 'monthly' },
      { loc: '/sakramen', priority: 0.7, changefreq: 'monthly' },
      { loc: '/sakramen/baptis', priority: 0.6, changefreq: 'monthly' },
      { loc: '/sakramen/ekaristi', priority: 0.6, changefreq: 'monthly' },
      { loc: '/sakramen/krisma', priority: 0.6, changefreq: 'monthly' },
      { loc: '/sakramen/pernikahan', priority: 0.6, changefreq: 'monthly' },
      { loc: '/sakramen/pengakuan-dosa', priority: 0.6, changefreq: 'monthly' },
      { loc: '/sakramen/pengurapan-orang-sakit', priority: 0.6, changefreq: 'monthly' },
      { loc: '/struktur', priority: 0.6, changefreq: 'monthly' },
      { loc: '/donasi', priority: 0.7, changefreq: 'monthly' },
    ],
  },

  runtimeConfig: {
    // Server-only (never exposed to browser)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    // Public (available in browser via useRuntimeConfig().public)
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL ?? '',
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY ?? '',
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  fonts: {
    families: [
      {
        name: 'Noto Serif',
        provider: 'google',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
      },
      {
        name: 'Manrope',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
      },
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Paroki Santa Melania Bandung',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Paroki Katolik Santa Melania, Bandung. Melayani umat sejak 1954 di Jl. Melania No.1-3, Cihaur Geulis, Kota Bandung. Jadwal Misa, Donasi, dan informasi paroki.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/jpeg', href: '/assets/logo.jpg' }],
    },
  },

  compatibilityDate: '2024-11-01',
})
