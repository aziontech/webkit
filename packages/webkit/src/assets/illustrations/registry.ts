export type IllustrationAssetLoader = () => Promise<{ default: string }>

export const loadIllustrationPlaceholder: IllustrationAssetLoader = () =>
  import('./placeholder.svg')

export const illustrationAssets = {
  'ai-applications': () => import('./ai-applications.svg'),
  'api-endpoints': () => import('./api-endpoints.svg'),
  'automate-threat-mitigation': () => import('./automate-threat-mitigation.svg'),
  'azion-to-akamai': () => import('./azion-to-akamai.svg'),
  'azion-to-aws': () => import('./azion-to-aws.svg'),
  'azion-to-cloudflare': () => import('./azion-to-cloudflare.svg'),
  'azion-to-fastly': () => import('./azion-to-fastly.svg'),
  'azion-to-vercel': () => import('./azion-to-vercel.svg'),
  'build-applications': () => import('./build-applications.svg'),
  'build-databases-from-code': () => import('./build-databases-from-code.svg'),
  'combine-data-and-vector-search': () => import('./combine-data-and-vector-search.svg'),
  'content-and-media-delivery': () => import('./content-and-media-delivery.svg'),
  'content-and-media-delivery-globe': () => import('./content-and-media-delivery-globe.svg'),
  'custom-allowed-rules': () => import('./custom-allowed-rules.svg'),
  'custom-rules-mitigation': () => import('./custom-rules-mitigation.svg'),
  'deploy-secure-mcp-server': () => import('./deploy-secure-mcp-server.svg'),
  'detect-and-classify': () => import('./detect-and-classify.svg'),
  'distributed-apis': () => import('./distributed-apis.svg'),
  'distributed-sql-for-resilient-global-reads': () =>
    import('./distributed-sql-for-resilient-global-reads.svg'),
  'dns-protection': () => import('./dns-protection.svg'),
  'enable-owasp-protection-with-customizable-rules': () =>
    import('./enable-owasp-protection-with-customizable-rules.svg'),
  'fastest-path-to-live-website': () => import('./fastest-path-to-live-website.svg'),
  'global-network': () => import('./global-network.svg'),
  'implement-api-gateway-security': () => import('./implement-api-gateway-security.svg'),
  'improve-application-performance-and-reliability': () =>
    import('./improve-application-performance-and-reliability.svg'),
  'infrastructure-as-code': () => import('./infrastructure-as-code.svg'),
  'intent-to-policy': () => import('./intent-to-policy.svg'),
  'live-debugging': () => import('./live-debugging.svg'),
  'low-latency': () => import('./low-latency.svg'),
  'mitigation-actions': () => import('./mitigation-actions.svg'),
  'models-and-lora': () => import('./models-and-lora.svg'),
  'modern-frontends': () => import('./modern-frontends.svg'),
  'multi-format-optimization-with-automatic-detection': () =>
    import('./multi-format-optimization-with-automatic-detection.svg'),
  'network-lists-rules-engine': () => import('./network-lists-rules-engine.svg'),
  'no-idle-no-waste': () => import('./no-idle-no-waste.svg'),
  preview: () => import('./preview.svg'),
  'profiles-per-application': () => import('./profiles-per-application.svg'),
  'programmable-security': () => import('./programmable-security.svg'),
  'protect-financial-applications': () => import('./protect-financial-applications.svg'),
  'quick-start-with-templates': () => import('./quick-start-with-templates.svg'),
  'read-at-the-edge': () => import('./read-at-the-edge.svg'),
  'replicated-reads': () => import('./replicated-reads.svg'),
  'reputation-intelligence-for-enhanced-protection': () =>
    import('./reputation-intelligence-for-enhanced-protection.svg'),
  'request-inspection': () => import('./request-inspection.svg'),
  'retail-application-modernization': () => import('./retail-application-modernization.svg'),
  runtime: () => import('./runtime.svg'),
  'saas-platforms': () => import('./saas-platforms.svg'),
  'stay-in-control': () => import('./stay-in-control.svg'),
  'stream-security-events-for-investigation-and-response': () =>
    import('./stream-security-events-for-investigation-and-response.svg'),
  'url-based-transformations-without-api-complexity': () =>
    import('./url-based-transformations-without-api-complexity.svg'),
  'white-gloves-when-it-matters': () => import('./white-gloves-when-it-matters.svg')
} satisfies Record<string, IllustrationAssetLoader>

/** Every registered scene name. */
export type IllustrationAssetName = keyof typeof illustrationAssets

export const illustrationAssetNames = Object.keys(
  illustrationAssets
).sort() as IllustrationAssetName[]

export function resolveIllustrationAsset(name: string): IllustrationAssetLoader | null {
  if (!Object.hasOwn(illustrationAssets, name)) return null
  return illustrationAssets[name as IllustrationAssetName]
}
