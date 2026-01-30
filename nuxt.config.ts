// https://nuxt.com/docs/api/configuration/nuxt-config
const defaultTokenTtlSeconds = 7 * 24 * 60 * 60
const configuredTokenTtlSeconds = Number(
  process.env.AUTH_TOKEN_TTL_SECONDS
  ?? process.env.NUXT_PUBLIC_AUTH_TOKEN_TTL_SECONDS
  ?? defaultTokenTtlSeconds,
)

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@unocss/nuxt',
  ],

  devtools: { enabled: true },
  ssr: false,

  app: {
    layoutTransition: false,
    head: {
      title: 'Nuxt Template',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      noscript: [{ innerHTML: 'Javascript is required.' }],
    },
    keepalive: true,
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    disableTransition: false,
  },

  runtimeConfig: {
    // 資料庫
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      name: process.env.DB_NAME || 'db',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_REDIRECT_URI || '/api/auth/google/callback',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'change-me-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || `${configuredTokenTtlSeconds || defaultTokenTtlSeconds}s`,
    },
    webhooks: {
      discordUrl: process.env.DISCORD_WEBHOOK_URL || '',
      discordUsername: process.env.DISCORD_WEBHOOK_USERNAME || 'App Alerts',
      discordAvatarUrl: process.env.DISCORD_WEBHOOK_AVATAR || '',
      discordMentionRoleId: process.env.DISCORD_WEBHOOK_MENTION_ROLE_ID || '',
      timeoutMs: Number(process.env.DISCORD_WEBHOOK_TIMEOUT_MS || 4000),
      sharedSecret: process.env.WEBHOOK_API_SECRET || '',
    },
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      authTokenTtlSeconds: Number(process.env.NUXT_PUBLIC_AUTH_TOKEN_TTL_SECONDS || configuredTokenTtlSeconds || defaultTokenTtlSeconds),
      uploadBearerToken: process.env.OFFICIAL_API_BEARER_TOKEN || '',
    },
  },

  devServer: {
    port: Number(process.env.DEV_SERVER_PORT) || 3000,
    host: process.env.DEV_SERVER_HOST || 'localhost',
  },

  watch: [
    '!**/node_modules/**',
    '!**/.git/**',
    '!**/.nuxt/**',
    '!**/.output/**',
    '!**/dist/**',
    '!**/.cache/**',
  ],

  compatibilityDate: '2025-07-15',
})
