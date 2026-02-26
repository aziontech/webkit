import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  let config = {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/templates', import.meta.url)),
        '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
        '@helpers': fileURLToPath(new URL('./src/helpers', import.meta.url)),
        'three/build/three.webgpu.js': path.resolve(
          __dirname,
          'node_modules/three/build/three.webgpu.js'
        ) // fix to wrong compilation of Globe dependencie
      }
    }
  }

  return config
})
