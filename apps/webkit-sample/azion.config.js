/**
 * Azion edge application configuration (Azion Bundler).
 *
 * The `vue` preset runs the project's Vite build and wraps the static
 * output in an SPA-mount edge handler, so history-mode `vue-router`
 * routes resolve to `index.html` at the edge.
 *
 * `defineConfig` from 'azion/config' is only an identity/typing helper;
 * since `azion` is not a dependency of this app we export the plain
 * config object directly. The deployed resources (edge application,
 * domain, storage bucket, rules) are tracked by the CLI in
 * `azion/azion.json` and updated on each `azion deploy`.
 *
 * Ship with: `pnpm run deploy` (see package.json) or `azion deploy`.
 */
export default {
  build: {
    preset: 'vue',
  },
};
