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
 * Schema: `storage` / `connectors` / `applications.rules` (the
 * `applications`-nested shape the CLI's bundler now requires), mirrored
 * from the sibling apps that already deploy on this shape —
 * apps/storybook/azion.config.mjs and apps/icons-gallery/azion.config.cjs.
 * The flat `origin`/`rules` top-level keys this file used to declare are
 * gone from the bundler's accepted config surface; `origin` is now a
 * named `connectors` entry, referenced per-rule by `set_connector`
 * instead of a shared "set origin for all requests" rule, so that rule
 * is gone — deliver and rewrite are the only two request rules now,
 * same as both sibling apps.
 *
 * `storage[].dir` is `./dist` — the `vue` preset's actual build output
 * (verified by running `azion build` directly), the same path
 * apps/storybook/azion.config.mjs uses for the same preset. The old
 * `azion/files.json` records a stale `.edge/storage/assets` path from a
 * prior bundler version; that layout no longer exists.
 * `storage[].prefix` / `connectors[].attributes.prefix` must equal
 * `azion/azion.json`'s own `prefix` — the CLI's `config replace` step
 * find-and-replaces that literal string here on every deploy that
 * rotates it (`rotate-prefix: true`), so once seeded they stay in sync
 * without further attention.
 *
 * `storage[].name` and `connectors[].attributes.bucket` must both be the
 * REAL bucket name (`BUCKET_NAME`, timestamp-suffixed) — the storage step
 * creates S3 credentials by that literal name, so a logical alias 404s
 * with "Bucket Does Not Exist". The connector's own `name` (not its
 * `attributes.bucket`) is the one field that stays the logical `BUCKET`
 * alias, since that is the connector RESOURCE's own name, already
 * registered under that alias on the account.
 *
 * The three request-rule extension lists below are still the app's own
 * widened list, not the `vue` preset's default. The preset ships
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
const BUCKET = 'webkit-sample'
// The real, globally-unique storage bucket name Azion generated for this app on its first
// link (`azion list storage bucket`) — NOT the same string as the app/connector/workload's own
// logical `BUCKET` name above. Object storage bucket names must be globally unique across the
// whole platform, so this one carries the timestamp Azion appended when it was first created.
const BUCKET_NAME = 'webkit-sample-20260901110703'
const PREFIX = '20260928090719'

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
  'ogg'
]

export default {
  build: {
    preset: 'vue',
    polyfills: true
  },
  storage: [
    {
      name: BUCKET_NAME,
      prefix: PREFIX,
      dir: './dist',
      workloadsAccess: 'read_only'
    }
  ],
  connectors: [
    {
      name: BUCKET,
      active: true,
      type: 'storage',
      attributes: {
        bucket: BUCKET_NAME,
        prefix: PREFIX
      }
    }
  ],
  applications: [
    {
      name: BUCKET,
      rules: {
        request: [
          {
            name: 'Deliver Static Assets',
            description: 'Deliver static assets directly from storage',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: `.(${STATIC_EXTENSIONS.join('|')})$`
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: BUCKET
                }
              },
              {
                type: 'deliver'
              }
            ]
          },
          {
            name: 'Redirect to index.html',
            description:
              'Handle all routes by rewriting to index.html for client-side routing',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '^\\/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: BUCKET
                }
              },
              {
                type: 'rewrite_request',
                attributes: {
                  value: '/index.html'
                }
              }
            ]
          }
        ],
        response: []
      }
    }
  ],
  workloads: [
    {
      name: BUCKET,
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: BUCKET,
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: BUCKET
            }
          }
        }
      ]
    }
  ]
}
