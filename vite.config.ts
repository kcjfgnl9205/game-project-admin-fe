import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwind from '@tailwindcss/vite'

const DEV_DOMAIN = 'local.puzmu.com'
const keyPath = fileURLToPath(new URL(`./.certs/${DEV_DOMAIN}-key.pem`, import.meta.url))
const certPath = fileURLToPath(new URL(`./.certs/${DEV_DOMAIN}.pem`, import.meta.url))
const hasCert = existsSync(keyPath) && existsSync(certPath)

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwind(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [DEV_DOMAIN, 'localhost'],
    https: hasCert ? { key: readFileSync(keyPath), cert: readFileSync(certPath) } : undefined,
    proxy: {
      '/api': {
        target: 'https://dev-api.puzmu.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
