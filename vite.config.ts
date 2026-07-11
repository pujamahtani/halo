import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// App/showcase build (the demo site deployed to Vercel).
// Outputs to dist-demo so the publishable library dist/ is never clobbered.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist-demo",
  },
  server: {
    port: 5174,
  },
})
