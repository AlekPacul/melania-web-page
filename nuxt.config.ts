// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ['@nuxt/ui'],

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
