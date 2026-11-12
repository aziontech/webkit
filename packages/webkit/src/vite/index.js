/**
 * @deprecated since 6.0 — WebKit no longer depends on vee-validate, so it has nothing to pre-bundle. An app that uses vee-validate sets `optimizeDeps: { include: ['vee-validate'] }` in its own Vite config instead. Removed in 7.0.
 * @type {{ optimizeDeps: { include: string[] } }}
 */
export const webkitViteConfig = {
  optimizeDeps: {
    include: ['vee-validate']
  }
}
