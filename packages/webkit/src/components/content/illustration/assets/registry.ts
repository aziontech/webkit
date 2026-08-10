import type { Component } from 'vue'

/**
 * The illustration asset registry — every value `<Illustration name="…">` accepts.
 *
 * An asset is a small SFC composed only of the illustration parts, so it inherits the
 * scene's `size` / `active` from context and never re-declares geometry. Loaders are
 * dynamic imports, so a consumer's bundle carries only the assets it names.
 *
 * To add one: create `<name>.vue` beside this file, composing parts only, and add a
 * line here. Do not reach for a bare element inside an asset — that is a token leak
 * that will not follow the theme.
 */
export type IllustrationAssetLoader = () => Promise<{ default: Component }>

export const illustrationAssets = {
  'ai-inference': () => import('./ai-inference.vue'),
  'api-keys': () => import('./api-keys.vue'),
  'azion-highlight': () => import('./azion-highlight.vue'),
  'bot-manager': () => import('./bot-manager.vue'),
  build: () => import('./build.vue'),
  deploy: () => import('./deploy.vue'),
  'edge-storage': () => import('./edge-storage.vue'),
  functions: () => import('./functions.vue'),
  'help-resources': () => import('./help-resources.vue'),
  'image-processor': () => import('./image-processor.vue'),
  'optimize-application': () => import('./optimize-application.vue'),
  path: () => import('./path.vue'),
  ship: () => import('./ship.vue'),
  'sql-database': () => import('./sql-database.vue'),
  'traffic-chart': () => import('./traffic-chart.vue'),
  'waf-rules': () => import('./waf-rules.vue')
} satisfies Record<string, IllustrationAssetLoader>

/** Every registered asset name. */
export type IllustrationAssetName = keyof typeof illustrationAssets

/** Sorted asset names — the values `name` accepts, for docs and stories. */
export const illustrationAssetNames = Object.keys(
  illustrationAssets
).sort() as IllustrationAssetName[]

/** The loader for `name`, or `null` when nothing is registered under it. */
export function resolveIllustrationAsset(name: string): IllustrationAssetLoader | null {
  if (!Object.hasOwn(illustrationAssets, name)) return null
  return illustrationAssets[name as IllustrationAssetName]
}
