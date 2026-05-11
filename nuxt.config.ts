// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxtjs/sitemap', '@vite-pwa/nuxt'],

  site: {
    url: 'https://paroki-melania-dev.my.id',
    name: 'Paroki Santa Melania Bandung',
  },

  // OWASP A05 — Security Misconfiguration: apply security headers to all routes
  routeRules: {
    '/**': {
      headers: {
        // Prevent clickjacking (OWASP A05 / CWE-1021)
        'X-Frame-Options': 'SAMEORIGIN',
        // Prevent MIME sniffing (OWASP A05 / CWE-430)
        'X-Content-Type-Options': 'nosniff',
        // Limit referrer leakage
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        // Disable unused browser features
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        // Force HTTPS for 1 year once the HTTP→HTTPS nginx redirect is in place (F-07)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        // Content Security Policy — 'unsafe-inline' required for Nuxt SSR hydration; worker-src for PWA service worker
        'Content-Security-Policy':
          "default-src 'self'; script-src 'self' 'unsafe-inline'; worker-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com; connect-src 'self' https://*.supabase.co; frame-src https://www.google.com; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'",
        // X-Powered-By is removed via server/plugins/security.ts (render:response hook)
      },
    },
  },

  sitemap: {
    strictNuxtContentPaths: false,
    // F-04: exclude admin and auth paths from sitemap (OWASP A05)
    exclude: ['/admin/**', '/login', '/lupa-sandi', '/reset-sandi'],
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
      { loc: '/sakramen/pengakuan', priority: 0.6, changefreq: 'monthly' },
      { loc: '/sakramen/pengurapan', priority: 0.6, changefreq: 'monthly' },
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
      link: [
        { rel: 'icon', href: '/assets/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', href: '/assets/apple-touch-icon-180x180.png' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    pwaAssets: {
      disabled: false,
      config: true,
    },
    manifest: {
      name: 'Paroki Santa Melania Bandung',
      short_name: 'Melania',
      description: 'Paroki Katolik Santa Melania, Bandung. Jadwal Misa, Donasi, dan informasi paroki.',
      theme_color: '#1a3b4c',
      background_color: '#faf9f8',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      lang: 'id',
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,webp,woff,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-cache',
            expiration: { maxEntries: 100, maxAgeSeconds: 3600 },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },

  compatibilityDate: '2024-11-01',
})
