import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages deployment base path
// Change '/qrcode/' to '/' if deploying to username.github.io root
// Or change to your repository name if different
const base = process.env.NODE_ENV === 'production' ? '/qrcode/' : '/'

export default defineConfig({
  plugins: [react()],
  base: base,
  server: {
    proxy: {
      '/api/countapi': {
        target: 'https://countapi.mileshilliard.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/countapi/, '/api/v1'),
      },
    },
  },
})

