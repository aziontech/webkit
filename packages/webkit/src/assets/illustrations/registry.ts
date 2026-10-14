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
  'ai-agents': () => import('./ai-agents.svg'),
  'ai-applications': () => import('./ai-applications.svg'),
  'ai-inference': () => import('./ai-inference.svg'),
  'ai-inference-isometric': () => import('./ai-inference-isometric.svg'),
  'ai-models': () => import('./ai-models.svg'),
  'ai-vector-search': () => import('./ai-vector-search.svg'),
  'application-accelerator': () => import('./application-accelerator.svg'),
  'application-accelerator-isometric': () => import('./application-accelerator-isometric.svg'),
  applications: () => import('./applications.svg'),
  'applications-isometric': () => import('./applications-isometric.svg'),
  'automate-threat-mitigation': () => import('./automate-threat-mitigation.svg'),
  'azion-to-akamai': () => import('./azion-to-akamai.svg'),
  'azion-to-aws': () => import('./azion-to-aws.svg'),
  'azion-to-cloudflare': () => import('./azion-to-cloudflare.svg'),
  'azion-to-fastly': () => import('./azion-to-fastly.svg'),
  'azion-to-vercel': () => import('./azion-to-vercel.svg'),
  'bot-manager': () => import('./bot-manager.svg'),
  'bot-manager-isometric': () => import('./bot-manager-isometric.svg'),
  'build-applications': () => import('./build-applications.svg'),
  cache: () => import('./cache.svg'),
  'cache-isometric': () => import('./cache-isometric.svg'),
  'data-stream': () => import('./data-stream.svg'),
  'data-stream-isometric': () => import('./data-stream-isometric.svg'),
  'database-query': () => import('./database-query.svg'),
  'database-replication': () => import('./database-replication.svg'),
  'database-sharding': () => import('./database-sharding.svg'),
  'ddos-mitigation': () => import('./ddos-mitigation.svg'),
  'ddos-mitigation-isometric': () => import('./ddos-mitigation-isometric.svg'),
  'deploy-secure-mcp-server': () => import('./deploy-secure-mcp-server.svg'),
  'distributed-apis': () => import('./distributed-apis.svg'),
  'dns-protection': () => import('./dns-protection.svg'),
  'edge-dns': () => import('./edge-dns.svg'),
  'edge-dns-isometric': () => import('./edge-dns-isometric.svg'),
  'edge-pulse': () => import('./edge-pulse.svg'),
  'edge-pulse-isometric': () => import('./edge-pulse-isometric.svg'),
  'events-funnel': () => import('./events-funnel.svg'),
  'events-timeline': () => import('./events-timeline.svg'),
  'fastest-path-to-live-website': () => import('./fastest-path-to-live-website.svg'),
  firewall: () => import('./firewall.svg'),
  'firewall-isometric': () => import('./firewall-isometric.svg'),
  functions: () => import('./functions.svg'),
  'functions-invocations': () => import('./functions-invocations.svg'),
  'functions-isometric': () => import('./functions-isometric.svg'),
  'functions-pipeline': () => import('./functions-pipeline.svg'),
  'global-network': () => import('./global-network.svg'),
  'image-processor': () => import('./image-processor.svg'),
  'image-processor-isometric': () => import('./image-processor-isometric.svg'),
  'implement-api-gateway-security': () => import('./implement-api-gateway-security.svg'),
  'improve-application-performance-and-reliability': () =>
    import('./improve-application-performance-and-reliability.svg'),
  'infra-rack': () => import('./infra-rack.svg'),
  'infra-regions': () => import('./infra-regions.svg'),
  'infra-scaling': () => import('./infra-scaling.svg'),
  'infrastructure-as-code': () => import('./infrastructure-as-code.svg'),
  'kv-store': () => import('./kv-store.svg'),
  'kv-store-isometric': () => import('./kv-store-isometric.svg'),
  'live-debugging': () => import('./live-debugging.svg'),
  'load-balancer': () => import('./load-balancer.svg'),
  'load-balancer-isometric': () => import('./load-balancer-isometric.svg'),
  'low-latency': () => import('./low-latency.svg'),
  'metrics-gauge': () => import('./metrics-gauge.svg'),
  'metrics-percentiles': () => import('./metrics-percentiles.svg'),
  'metrics-sparklines': () => import('./metrics-sparklines.svg'),
  'modern-frontends': () => import('./modern-frontends.svg'),
  'network-anycast': () => import('./network-anycast.svg'),
  'network-latency': () => import('./network-latency.svg'),
  'network-shield': () => import('./network-shield.svg'),
  'network-shield-isometric': () => import('./network-shield-isometric.svg'),
  'no-idle-no-waste': () => import('./no-idle-no-waste.svg'),
  'object-storage': () => import('./object-storage.svg'),
  'object-storage-isometric': () => import('./object-storage-isometric.svg'),
  'observe-alerts': () => import('./observe-alerts.svg'),
  'observe-logs': () => import('./observe-logs.svg'),
  'observe-traces': () => import('./observe-traces.svg'),
  orchestrator: () => import('./orchestrator.svg'),
  'orchestrator-isometric': () => import('./orchestrator-isometric.svg'),
  'our-network': () => import('./our-network.svg'),
  'our-network-isometric': () => import('./our-network-isometric.svg'),
  preview: () => import('./preview.svg'),
  'programmable-security': () => import('./programmable-security.svg'),
  'protect-financial-applications': () => import('./protect-financial-applications.svg'),
  'quick-start-with-templates': () => import('./quick-start-with-templates.svg'),
  'real-time-events': () => import('./real-time-events.svg'),
  'real-time-events-isometric': () => import('./real-time-events-isometric.svg'),
  'real-time-metrics': () => import('./real-time-metrics.svg'),
  'real-time-metrics-isometric': () => import('./real-time-metrics-isometric.svg'),
  'retail-application-modernization': () => import('./retail-application-modernization.svg'),
  runtime: () => import('./runtime.svg'),
  'saas-platforms': () => import('./saas-platforms.svg'),
  'secure-certificate': () => import('./secure-certificate.svg'),
  'secure-keys': () => import('./secure-keys.svg'),
  'secure-rules': () => import('./secure-rules.svg'),
  'secure-tokens': () => import('./secure-tokens.svg'),
  'sql-database': () => import('./sql-database.svg'),
  'sql-database-isometric': () => import('./sql-database-isometric.svg'),
  'stay-in-control': () => import('./stay-in-control.svg'),
  waf: () => import('./waf.svg'),
  'waf-isometric': () => import('./waf-isometric.svg'),
  'white-gloves-when-it-matters': () => import('./white-gloves-when-it-matters.svg'),
  workloads: () => import('./workloads.svg'),
  'workloads-hostnames': () => import('./workloads-hostnames.svg'),
  'workloads-isometric': () => import('./workloads-isometric.svg'),
  'workloads-rollout': () => import('./workloads-rollout.svg')
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
