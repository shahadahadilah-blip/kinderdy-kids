import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: ((globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITE_BASE) ?? '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5180, strictPort: true, host: true, allowedHosts: true },
  preview: { port: 4180, strictPort: true, host: true, allowedHosts: true },
})
