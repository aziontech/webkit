export type IllustrationAssetLoader = () => Promise<{ default: string }>

/** Loads the frame shown when `name` is empty or names no registered scene. */
export const loadIllustrationPlaceholder: IllustrationAssetLoader = () =>
  import('./placeholder.svg?raw')

export const illustrationAssets = {
  'ai-applications': () => import('./ai-applications.svg?raw'),
  'automate-threat-mitigation': () => import('./automate-threat-mitigation.svg?raw'),
  'azion-to-akamai': () => import('./azion-to-akamai.svg?raw'),
  'azion-to-aws': () => import('./azion-to-aws.svg?raw'),
  'azion-to-cloudflare': () => import('./azion-to-cloudflare.svg?raw'),
  'azion-to-fastly': () => import('./azion-to-fastly.svg?raw'),
  'azion-to-vercel': () => import('./azion-to-vercel.svg?raw'),
  'build-applications': () => import('./build-applications.svg?raw'),
  'deploy-secure-mcp-server': () => import('./deploy-secure-mcp-server.svg?raw'),
  'distributed-apis': () => import('./distributed-apis.svg?raw'),
  'dns-protection': () => import('./dns-protection.svg?raw'),
  'fastest-path-to-live-website': () => import('./fastest-path-to-live-website.svg?raw'),
  'global-network': () => import('./global-network.svg?raw'),
  'implement-api-gateway-security': () => import('./implement-api-gateway-security.svg?raw'),
  'improve-application-performance-and-reliability': () =>
    import('./improve-application-performance-and-reliability.svg?raw'),
  'infrastructure-as-code': () => import('./infrastructure-as-code.svg?raw'),
  'live-debugging': () => import('./live-debugging.svg?raw'),
  'low-latency': () => import('./low-latency.svg?raw'),
  'modern-frontends': () => import('./modern-frontends.svg?raw'),
  'no-idle-no-waste': () => import('./no-idle-no-waste.svg?raw'),
  preview: () => import('./preview.svg?raw'),
  'programmable-security': () => import('./programmable-security.svg?raw'),
  'protect-financial-applications': () => import('./protect-financial-applications.svg?raw'),
  'quick-start-with-templates': () => import('./quick-start-with-templates.svg?raw'),
  'retail-application-modernization': () => import('./retail-application-modernization.svg?raw'),
  runtime: () => import('./runtime.svg?raw'),
  'saas-platforms': () => import('./saas-platforms.svg?raw'),
  'stay-in-control': () => import('./stay-in-control.svg?raw'),
  'white-gloves-when-it-matters': () => import('./white-gloves-when-it-matters.svg?raw')
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
