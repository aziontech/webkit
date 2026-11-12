export type IllustrationAssetLoader = () => Promise<{ default: string }>

export const loadIllustrationPlaceholder: IllustrationAssetLoader = () =>
  import('./placeholder.svg')

export const illustrationAssets = {
  'ai-applications': () => import('./ai-applications.svg'),
  'ai-gateway': () => import('./ai-gateway.svg'),
  'api-endpoints': () => import('./api-endpoints.svg'),
  'automate-threat-mitigation': () => import('./automate-threat-mitigation.svg'),
  'azion-highlight': () => import('./azion-highlight.svg'),
  'azion-rest-api': () => import('./azion-rest-api.svg'),
  'azion-to-akamai': () => import('./azion-to-akamai.svg'),
  'azion-to-aws': () => import('./azion-to-aws.svg'),
  'azion-to-cloudflare': () => import('./azion-to-cloudflare.svg'),
  'azion-to-commerce-tiles': () => import('./azion-to-commerce-tiles.svg'),
  'azion-to-fastly': () => import('./azion-to-fastly.svg'),
  'azion-to-vercel': () => import('./azion-to-vercel.svg'),
  branches: () => import('./branches.svg'),
  'build-applications': () => import('./build-applications.svg'),
  'chat-and-headset-tiles': () => import('./chat-and-headset-tiles.svg'),
  'combine-data-and-vector-search': () => import('./combine-data-and-vector-search.svg'),
  'content-and-media-delivery': () => import('./content-and-media-delivery.svg'),
  'content-and-media-delivery-globe': () => import('./content-and-media-delivery-globe.svg'),
  'custom-allowed-rules': () => import('./custom-allowed-rules.svg'),
  'custom-rules-mitigation': () => import('./custom-rules-mitigation.svg'),
  'data-stream-destinations-map': () => import('./data-stream-destinations-map.svg'),
  'ddos-protection': () => import('./ddos-protection.svg'),
  'deploy-secure-mcp-server': () => import('./deploy-secure-mcp-server.svg'),
  'detect-and-classify': () => import('./detect-and-classify.svg'),
  'distributed-apis': () => import('./distributed-apis.svg'),
  'distributed-apis-tile': () => import('./distributed-apis-tile.svg'),
  'dns-protection': () => import('./dns-protection.svg'),
  'fastest-path-to-live-website': () => import('./fastest-path-to-live-website.svg'),
  'global-network': () => import('./global-network.svg'),
  'globe-with-sql-nodes': () => import('./globe-with-sql-nodes.svg'),
  'implement-api-gateway-security': () => import('./implement-api-gateway-security.svg'),
  'improve-application-performance-and-reliability': () =>
    import('./improve-application-performance-and-reliability.svg'),
  'infrastructure-as-code': () => import('./infrastructure-as-code.svg'),
  'intent-to-policy': () => import('./intent-to-policy.svg'),
  'live-debugging': () => import('./live-debugging.svg'),
  'low-latency': () => import('./low-latency.svg'),
  'mitigation-actions': () => import('./mitigation-actions.svg'),
  'modern-frontends': () => import('./modern-frontends.svg'),
  'multi-format-optimization-with-automatic-detection': () =>
    import('./multi-format-optimization-with-automatic-detection.svg'),
  'network-lists-rules-engine': () => import('./network-lists-rules-engine.svg'),
  'no-idle-no-waste': () => import('./no-idle-no-waste.svg'),
  'personal-tokens': () => import('./personal-tokens.svg'),
  preview: () => import('./preview.svg'),
  'profiles-per-application': () => import('./profiles-per-application.svg'),
  'programmable-security': () => import('./programmable-security.svg'),
  'protect-financial-applications': () => import('./protect-financial-applications.svg'),
  'quick-start-with-templates': () => import('./quick-start-with-templates.svg'),
  'read-at-the-edge': () => import('./read-at-the-edge.svg'),
  'real-time-metrics-error-rate': () => import('./real-time-metrics-error-rate.svg'),
  'real-time-metrics-status-codes': () => import('./real-time-metrics-status-codes.svg'),
  'replicated-reads': () => import('./replicated-reads.svg'),
  'reputation-rings-hub': () => import('./reputation-rings-hub.svg'),
  'request-inspection': () => import('./request-inspection.svg'),
  'retail-application-modernization': () => import('./retail-application-modernization.svg'),
  runtime: () => import('./runtime.svg'),
  'sql-sdk-code-cards': () => import('./sql-sdk-code-cards.svg'),
  'traffic-and-cost-bar-chart': () => import('./traffic-and-cost-bar-chart.svg'),
  'url-based-transformations-without-api-complexity': () =>
    import('./url-based-transformations-without-api-complexity.svg'),
  'usage-chart': () => import('./usage-chart.svg'),
  'waf-threat-families-panel': () => import('./waf-threat-families-panel.svg')
} satisfies Record<string, IllustrationAssetLoader>

/** Every registered scene name. */
export type IllustrationAssetName = keyof typeof illustrationAssets

export const illustrationAssetAliases = {
  /** @deprecated since 6.0 — use `sql-sdk-code-cards` instead. Removed in 7.0. */
  'build-databases-from-code': 'sql-sdk-code-cards',
  /** @deprecated since 6.0 — use `globe-with-sql-nodes` instead. Removed in 7.0. */
  'distributed-sql-for-resilient-global-reads': 'globe-with-sql-nodes',
  /** @deprecated since 6.0 — use `waf-threat-families-panel` instead. Removed in 7.0. */
  'enable-owasp-protection-with-customizable-rules': 'waf-threat-families-panel',
  /** @deprecated since 6.0 — use `reputation-rings-hub` instead. Removed in 7.0. */
  'reputation-intelligence-for-enhanced-protection': 'reputation-rings-hub',
  /** @deprecated since 6.0 — use `azion-to-commerce-tiles` instead. Removed in 7.0. */
  'saas-platforms': 'azion-to-commerce-tiles',
  /** @deprecated since 6.0 — use `traffic-and-cost-bar-chart` instead. Removed in 7.0. */
  'stay-in-control': 'traffic-and-cost-bar-chart',
  /** @deprecated since 6.0 — use `data-stream-destinations-map` instead. Removed in 7.0. */
  'stream-security-events-for-investigation-and-response': 'data-stream-destinations-map',
  /** @deprecated since 6.0 — use `chat-and-headset-tiles` instead. Removed in 7.0. */
  'white-gloves-when-it-matters': 'chat-and-headset-tiles'
} as const satisfies Record<string, IllustrationAssetName>

/** A retired scene name that still resolves to its renamed scene until 7.0. */
export type DeprecatedIllustrationAssetName = keyof typeof illustrationAssetAliases

export const illustrationAssetNames = Object.keys(
  illustrationAssets
).sort() as IllustrationAssetName[]

export function resolveIllustrationAssetName(name: string): IllustrationAssetName | null {
  if (Object.hasOwn(illustrationAssets, name)) return name as IllustrationAssetName
  if (Object.hasOwn(illustrationAssetAliases, name)) {
    return illustrationAssetAliases[name as DeprecatedIllustrationAssetName]
  }
  return null
}

export function resolveIllustrationAsset(name: string): IllustrationAssetLoader | null {
  const resolved = resolveIllustrationAssetName(name)
  return resolved ? illustrationAssets[resolved] : null
}
