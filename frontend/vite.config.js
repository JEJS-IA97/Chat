import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  cacheDir: '.vite-cache',
  plugins: [
    tailwindcss(),
  ],
})
