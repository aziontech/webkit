# Illustrations

> The official product illustration scenes, drawn into the page as inline SVG and repainted from the theme.

Pass the name to `Illustration` (`name`) or to a section that shows one (`illustration`).

68 names. These are the only values the components accept. An unknown name renders a "PLACE DESIGN ASSET" placeholder and warns in the console. The MCP tool `list_assets({ kind: "illustrations" })` returns the same list (with a `query` to filter), and `catalog.json#assets.illustrations` points at it as data.

Used by: [FeatureScroll](../components/feature-scroll.md), [FeatureTabs](../components/feature-tabs.md), [FeatureTiles](../components/feature-tiles.md), [FeatureWidgets](../components/feature-widgets.md), [HeroBand](../components/hero-band.md), [Illustration](../components/illustration.md), [MediaSplitBand](../components/media-split-band.md), [MediaSplitStack](../components/media-split-stack.md), [SitePage](../components/site-page.md).

## Usage

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <Illustration name="ddos-protection" />
</template>
```

## Names

| Name | Canvas | Status |
| --- | --- | --- |
| `ai-applications` | 592x300 |  |
| `ai-gateway` | 272x295 |  |
| `api-endpoints` | 960x487 |  |
| `automate-threat-mitigation` | 592x300 |  |
| `azion-highlight` | 170x128 |  |
| `azion-rest-api` | 366x176 |  |
| `azion-to-akamai` | 592x300 |  |
| `azion-to-aws` | 592x300 |  |
| `azion-to-cloudflare` | 592x300 |  |
| `azion-to-commerce-tiles` | 592x300 |  |
| `azion-to-fastly` | 592x300 |  |
| `azion-to-vercel` | 592x300 |  |
| `branches` | 170x128 |  |
| `build-applications` | 592x300 |  |
| `build-databases-from-code` | 592x300 | Deprecated: use `sql-sdk-code-cards`. Removed in 7.0. |
| `chat-and-headset-tiles` | 230x154 |  |
| `combine-data-and-vector-search` | 592x300 |  |
| `content-and-media-delivery` | 583x296 |  |
| `content-and-media-delivery-globe` | 625x317 |  |
| `custom-allowed-rules` | 592x300 |  |
| `custom-rules-mitigation` | 592x300 |  |
| `data-stream-destinations-map` | 592x300 |  |
| `ddos-protection` | 186x286 |  |
| `deploy-secure-mcp-server` | 592x300 |  |
| `detect-and-classify` | 592x300 |  |
| `distributed-apis` | 592x300 |  |
| `distributed-apis-tile` | 414x148 |  |
| `distributed-sql-for-resilient-global-reads` | 592x300 | Deprecated: use `globe-with-sql-nodes`. Removed in 7.0. |
| `dns-protection` | 592x300 |  |
| `enable-owasp-protection-with-customizable-rules` | 592x300 | Deprecated: use `waf-threat-families-panel`. Removed in 7.0. |
| `fastest-path-to-live-website` | 592x300 |  |
| `global-network` | 592x300 |  |
| `globe-with-sql-nodes` | 592x300 |  |
| `implement-api-gateway-security` | 592x300 |  |
| `improve-application-performance-and-reliability` | 592x300 |  |
| `infrastructure-as-code` | 667x338 |  |
| `intent-to-policy` | 592x300 |  |
| `live-debugging` | 592x300 |  |
| `low-latency` | 592x300 |  |
| `mitigation-actions` | 592x300 |  |
| `modern-frontends` | 592x300 |  |
| `multi-format-optimization-with-automatic-detection` | 592x300 |  |
| `network-lists-rules-engine` | 592x300 |  |
| `no-idle-no-waste` | 230x154 |  |
| `personal-tokens` | 170x128 |  |
| `preview` | 592x300 |  |
| `profiles-per-application` | 592x300 |  |
| `programmable-security` | 592x300 |  |
| `protect-financial-applications` | 592x300 |  |
| `quick-start-with-templates` | 360x165 |  |
| `read-at-the-edge` | 592x300 |  |
| `real-time-metrics-error-rate` | 366x193 |  |
| `real-time-metrics-status-codes` | 366x250 |  |
| `replicated-reads` | 592x300 |  |
| `reputation-intelligence-for-enhanced-protection` | 592x300 | Deprecated: use `reputation-rings-hub`. Removed in 7.0. |
| `reputation-rings-hub` | 592x300 |  |
| `request-inspection` | 754x382 |  |
| `retail-application-modernization` | 592x300 |  |
| `runtime` | 592x300 |  |
| `saas-platforms` | 592x300 | Deprecated: use `azion-to-commerce-tiles`. Removed in 7.0. |
| `sql-sdk-code-cards` | 592x300 |  |
| `stay-in-control` | 230x154 | Deprecated: use `traffic-and-cost-bar-chart`. Removed in 7.0. |
| `stream-security-events-for-investigation-and-response` | 592x300 | Deprecated: use `data-stream-destinations-map`. Removed in 7.0. |
| `traffic-and-cost-bar-chart` | 230x154 |  |
| `url-based-transformations-without-api-complexity` | 592x300 |  |
| `usage-chart` | 170x128 |  |
| `waf-threat-families-panel` | 592x300 |  |
| `white-gloves-when-it-matters` | 230x154 | Deprecated: use `chat-and-headset-tiles`. Removed in 7.0. |
