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
 * The three request rules below are the `vue` preset's own rules,
 * restated here so `Deliver Static Assets` can carry a wider extension
 * list. The preset ships
 * `.(css|js|ttf|woff|woff2|pdf|svg|jpg|jpeg|gif|bmp|png|ico|mp4|json|xml|html)$`,
 * which has no `webp` — so every `.webp` missed the deliver rule, fell
 * through to `Redirect to index.html`, and was served as the SPA shell
 * (`200 text/html`) instead of an image. That silently broke the deck
 * images at /preview and the WebP client logos, with a 200 and no error
 * anywhere. Any format the app can emit is listed, so adding an image
 * to a slide never needs an edge-rule change again.
 *
 * Ship with: `pnpm run deploy` (see package.json) or `azion deploy`.
 */
const STORAGE_ORIGIN = {
  name: 'origin-storage-default',
  type: 'object_storage',
};

/**
 * Every static extension the Vite build can emit, in one place.
 * Grouped so a missing format is obvious at a glance.
 */
const STATIC_EXTENSIONS = [
  // documents / data
  'html',
  'json',
  'xml',
  'txt',
  'md',
  'csv',
  'pdf',
  'webmanifest',
  // code
  'css',
  'js',
  'mjs',
  'map',
  'wasm',
  // raster images
  'png',
  'jpg',
  'jpeg',
  'gif',
  'bmp',
  'webp',
  'avif',
  'ico',
  // vector images
  'svg',
  // fonts
  'woff',
  'woff2',
  'ttf',
  'otf',
  'eot',
  // media
  'mp4',
  'webm',
  'mp3',
  'ogg',
];

export default {
  build: {
    preset: 'vue',
  },
  origin: [STORAGE_ORIGIN],
  rules: {
    request: [
      {
        name: 'Set Storage Origin for All Requests',
        match: '^\\/',
        behavior: {
          setOrigin: STORAGE_ORIGIN,
        },
      },
      {
        name: 'Deliver Static Assets',
        match: `.(${STATIC_EXTENSIONS.join('|')})$`,
        behavior: {
          setOrigin: STORAGE_ORIGIN,
          deliver: true,
        },
      },
      {
        name: 'Redirect to index.html',
        match: '^\\/',
        behavior: {
          rewrite: '/index.html',
        },
      },
    ],
  },
};
