import { defineConfig } from "vite"

export default defineConfig({
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      overlay: true,
    },
    fs: {
      strict: false,
    },
  },
})
