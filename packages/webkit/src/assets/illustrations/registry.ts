// Every value `<Illustration name="…">` accepts. Each entry is an official scene from the
// Assets library in Figma, on that file's 592x300 canvas; the SVG is the source of truth.
// Loaders are dynamic imports, so a bundle carries only the scenes its pages name.
// To add one: export the frame at 592x300, drop the `.svg` here under the frame's own
// name, and add a line below.
export type IllustrationAssetLoader = () => Promise<{ default: string }>

// Loaded like every scene, never imported statically: a static asset import is inlined
// into the entry chunk, so every consumer would pay for a frame only an unfinished screen
// shows. Out of `illustrationAssets` on purpose — a missing scene, not one a page picks.
/** Loads the frame shown when `name` is empty or names no registered scene. */
export const loadIllustrationPlaceholder: IllustrationAssetLoader = () =>
  import('./placeholder.svg')

export const illustrationAssets = {
  'ai-applications': () => import('./ai-applications.svg'),
  'automate-threat-mitigation': () => import('./automate-threat-mitigation.svg'),
  'azion-to-vercel': () => import('./azion-to-vercel.svg'),
  'build-applications': () => import('./build-applications.svg'),
  'deploy-secure-mcp-server': () => import('./deploy-secure-mcp-server.svg'),
  'distributed-apis': () => import('./distributed-apis.svg'),
  'dns-protection': () => import('./dns-protection.svg'),
  'fastest-path-to-live-website': () => import('./fastest-path-to-live-website.svg'),
  'implement-api-gateway-security': () => import('./implement-api-gateway-security.svg'),
  'infrastructure-as-code': () => import('./infrastructure-as-code.svg'),
  'live-debugging': () => import('./live-debugging.svg'),
  'modern-frontends': () => import('./modern-frontends.svg'),
  preview: () => import('./preview.svg'),
  'programmable-security': () => import('./programmable-security.svg'),
  'protect-financial-applications': () => import('./protect-financial-applications.svg'),
  'quick-start-with-templates': () => import('./quick-start-with-templates.svg'),
  'retail-application-modernization': () => import('./retail-application-modernization.svg'),
  runtime: () => import('./runtime.svg'),
  'saas-platforms': () => import('./saas-platforms.svg')
} satisfies Record<string, IllustrationAssetLoader>

/** Every registered scene name. */
export type IllustrationAssetName = keyof typeof illustrationAssets

/** Sorted scene names — the values `name` accepts, for docs and stories. */
export const illustrationAssetNames = Object.keys(
  illustrationAssets
).sort() as IllustrationAssetName[]

/** The loader for `name`, or `null` when nothing is registered under it. */
export function resolveIllustrationAsset(name: string): IllustrationAssetLoader | null {
  if (!Object.hasOwn(illustrationAssets, name)) return null
  return illustrationAssets[name as IllustrationAssetName]
}
