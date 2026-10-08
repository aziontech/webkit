export type IllustrationAssetLoader = () => Promise<{ default: string }>

/** Loads the frame shown when `name` is empty or names no registered scene. */
export const loadIllustrationPlaceholder: IllustrationAssetLoader = () =>
  import('./placeholder.svg')

export const illustrationAssets = {
  'ai-applications': () => import('./ai-applications.svg'),
  'automate-threat-mitigation': () => import('./automate-threat-mitigation.svg'),
  'azion-to-akamai': () => import('./azion-to-akamai.svg'),
  'azion-to-aws': () => import('./azion-to-aws.svg'),
  'azion-to-cloudflare': () => import('./azion-to-cloudflare.svg'),
  'azion-to-fastly': () => import('./azion-to-fastly.svg'),
  'azion-to-vercel': () => import('./azion-to-vercel.svg'),
  'build-applications': () => import('./build-applications.svg'),
  'deploy-secure-mcp-server': () => import('./deploy-secure-mcp-server.svg'),
  'distributed-apis': () => import('./distributed-apis.svg'),
  'dns-protection': () => import('./dns-protection.svg'),
  'fastest-path-to-live-website': () => import('./fastest-path-to-live-website.svg'),
  'global-network': () => import('./global-network.svg'),
  'implement-api-gateway-security': () => import('./implement-api-gateway-security.svg'),
  'improve-application-performance-and-reliability': () =>
    import('./improve-application-performance-and-reliability.svg'),
  'infrastructure-as-code': () => import('./infrastructure-as-code.svg'),
  'live-debugging': () => import('./live-debugging.svg'),
  'low-latency': () => import('./low-latency.svg'),
  'modern-frontends': () => import('./modern-frontends.svg'),
  'no-idle-no-waste': () => import('./no-idle-no-waste.svg'),
  preview: () => import('./preview.svg'),
  'programmable-security': () => import('./programmable-security.svg'),
  'protect-financial-applications': () => import('./protect-financial-applications.svg'),
  'quick-start-with-templates': () => import('./quick-start-with-templates.svg'),
  'retail-application-modernization': () => import('./retail-application-modernization.svg'),
  runtime: () => import('./runtime.svg'),
  'saas-platforms': () => import('./saas-platforms.svg'),
  'stay-in-control': () => import('./stay-in-control.svg'),
  'white-gloves-when-it-matters': () => import('./white-gloves-when-it-matters.svg')
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
