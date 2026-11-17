import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds to one self-contained file at ../kit/index.html, so the portfolio's
// no-build Vercel deploy serves it at /kit with nothing else to configure.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: { outDir: '../kit', emptyOutDir: true },
})
