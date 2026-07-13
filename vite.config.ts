import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this as a project site at /MemoryGames/, but the
  // local dev server should keep serving from the root.
  base: command === 'build' ? '/MemoryGames/' : '/',
  plugins: [react(), tailwindcss()],
}))
