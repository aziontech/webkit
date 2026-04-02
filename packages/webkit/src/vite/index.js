/**
 * Vite configuration helper for apps consuming @aziontech/webkit.
 *
 * Ensures PrimeVue internal modules (EventBus, Symbols) are pre-bundled
 * as a single chunk, preventing singleton duplication.
 *
 * Usage in vite.config.js:
 *   import { webkitViteConfig } from '@aziontech/webkit/vite'
 *
 *   export default defineConfig({
 *     ...webkitViteConfig,
 *     // your config
 *   })
 *
 * Or merge manually:
 *   optimizeDeps: {
 *     include: [...webkitViteConfig.optimizeDeps.include]
 *   }
 */
export const webkitViteConfig = {
  optimizeDeps: {
    include: [
      'primevue/toasteventbus',
      'primevue/usetoast',
      'primevue/toastservice',
      'primevue/usedialog',
      'primevue/dialogservice',
      'primevue/dynamicdialogeventbus',
      'primevue/config',
      'primevue/tooltip',
      'primevue/api',
      'primevue/utils'
    ]
  }
}
