/**
 * Azion Bundler configuration.
 * Selects the `vue` preset, which builds the Vite app and wraps the
 * static output in an SPA-mount edge handler (history-mode routing).
 *
 * `defineConfig` from 'azion/config' is an identity helper; since `azion`
 * is not a project dependency we export the plain config object directly.
 */
export default {
  build: {
    preset: 'vue',
  },
};
