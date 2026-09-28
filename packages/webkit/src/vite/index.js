/** Vite helper for consumer apps: pre-bundles vee-validate as one chunk so its singletons are not duplicated. Spread into defineConfig, or merge optimizeDeps.include. */
export const webkitViteConfig = {
  optimizeDeps: {
    include: ['vee-validate']
  }
}
