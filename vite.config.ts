import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base: './' → funktioniert auf GitHub Pages unabhängig vom Repo-Namen (wir nutzen Hash-Routing)
export default defineConfig({
  base: './',
  plugins: [react()],
})
