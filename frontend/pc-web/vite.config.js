// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/AppData/**',
        '**/BaiduYunKernel/**',
        '**/.workbuddy/**',
        '**/Windows/**',
        '**/ProgramData/**',
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
