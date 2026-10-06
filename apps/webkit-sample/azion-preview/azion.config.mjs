/**
 * Azion config for the internal deploy preview (v4 schema, CLI 4.x).
 *
 * Kept apart from the shared ../azion.config.js (v3 shape, used by the
 * source deploy) — scripts/deploy-preview.sh swaps this file in only for
 * the build and deploy, and always restores the original.
 */
const STATIC_EXTENSIONS = [
  'html', 'json', 'xml', 'txt', 'md', 'csv', 'pdf', 'webmanifest',
  'css', 'js', 'mjs', 'map', 'wasm',
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'avif', 'ico', 'svg',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  'mp4', 'webm', 'mp3', 'ogg',
];

// Names are literal and the bucket prefix is pinned (rotate-prefix: false in azion.json),
// so uploads and the storage connector always point at the same folder.
export default {
  build: { preset: 'vue', bundler: 'esbuild' },
  storage: [
    { name: 'webkit-sample-preview', prefix: 'preview', dir: './.edge/assets', workloadsAccess: 'read_only' },
  ],
  connectors: [
    {
      name: 'webkit-sample-preview-storage',
      active: true,
      type: 'storage',
      attributes: { bucket: 'webkit-sample-preview', prefix: 'preview' },
    },
  ],
  applications: [
    {
      name: 'webkit-sample-preview',
      cache: [{ name: 'webkit-sample-preview', browser: { maxAgeSeconds: 7200 }, edge: { maxAgeSeconds: 7200 } }],
      rules: {
        request: [
          {
            name: 'Deliver Static Assets',
            active: true,
            criteria: [
              [{ variable: '${uri}', conditional: 'if', operator: 'matches', argument: `\\.(${STATIC_EXTENSIONS.join('|')})$` }],
            ],
            behaviors: [
              { type: 'set_connector', attributes: { value: 'webkit-sample-preview-storage' } },
              { type: 'set_cache_policy', attributes: { value: 'webkit-sample-preview' } },
              { type: 'deliver' },
            ],
          },
          {
            name: 'Rewrite SPA routes to index.html',
            active: true,
            criteria: [[{ variable: '${uri}', conditional: 'if', operator: 'matches', argument: '^/' }]],
            behaviors: [
              { type: 'set_connector', attributes: { value: 'webkit-sample-preview-storage' } },
              { type: 'set_cache_policy', attributes: { value: 'webkit-sample-preview' } },
              { type: 'rewrite_request', attributes: { value: '/index.html' } },
              { type: 'deliver' },
            ],
          },
        ],
      },
    },
  ],
  workloads: [
    {
      name: 'webkit-sample-preview',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'webkit-sample-preview',
          current: true,
          active: true,
          strategy: { type: 'default', attributes: { application: 'webkit-sample-preview' } },
        },
      ],
    },
  ],
};
