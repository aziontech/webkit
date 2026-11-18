import type { Component } from 'vue'

/** Loads one content component drawn from data. */
export type ContentSceneLoader = () => Promise<{ default: Component }>

const loaders = {
  Accordion: () => import('../components/content/accordion/accordion.vue'),
  AccordionContent: () =>
    import('../components/content/accordion/accordion-content/accordion-content.vue'),
  AccordionItem: () => import('../components/content/accordion/accordion-item/accordion-item.vue'),
  AccordionTrigger: () =>
    import('../components/content/accordion/accordion-trigger/accordion-trigger.vue'),
  BarList: () => import('../components/chart/bar-list/bar-list.vue'),
  Card: () => import('../components/content/card/card.vue'),
  Carousel: () => import('../components/content/carousel/carousel.vue'),
  CarouselItem: () => import('../components/content/carousel/carousel-item/carousel-item.vue'),
  CarouselNext: () => import('../components/content/carousel/carousel-next/carousel-next.vue'),
  CarouselPrevious: () =>
    import('../components/content/carousel/carousel-previous/carousel-previous.vue'),
  Chart: () => import('../components/chart/chart/chart.vue'),
  ChartArea: () => import('../components/chart/chart/chart-area/chart-area.vue'),
  ChartAxis: () => import('../components/chart/chart/chart-axis/chart-axis.vue'),
  ChartBar: () => import('../components/chart/chart/chart-bar/chart-bar.vue'),
  ChartCrosshair: () => import('../components/chart/chart/chart-crosshair/chart-crosshair.vue'),
  ChartGrid: () => import('../components/chart/chart/chart-grid/chart-grid.vue'),
  ChartLegend: () => import('../components/chart/chart/chart-legend/chart-legend.vue'),
  ChartLine: () => import('../components/chart/chart/chart-line/chart-line.vue'),
  ChartReference: () => import('../components/chart/chart/chart-reference/chart-reference.vue'),
  ChartScatter: () => import('../components/chart/chart/chart-scatter/chart-scatter.vue'),
  ChartTooltip: () => import('../components/chart/chart/chart-tooltip/chart-tooltip.vue'),
  CodeBlock: () => import('../components/code/code-block/code-block.vue'),
  ConsoleMockup: () => import('../components/content/console-mockup/console-mockup.vue'),
  Diagram: () => import('../components/marketing/diagram/diagram.vue'),
  DonutChart: () => import('../components/chart/donut-chart/donut-chart.vue'),
  Embed: () => import('../components/content/embed/embed.vue'),
  Faq: () => import('../components/marketing/faq/faq.vue'),
  GaugeChart: () => import('../components/chart/gauge-chart/gauge-chart.vue'),
  Illustration: () => import('../components/content/illustration/illustration.vue'),
  IntegrationCard: () => import('../components/content/integration-card/integration-card.vue'),
  KeyValueList: () => import('../components/content/key-value-list/key-value-list.vue'),
  KeyValueListGroup: () =>
    import('../components/content/key-value-list/key-value-list-group/key-value-list-group.vue'),
  KeyValueListItem: () =>
    import('../components/content/key-value-list/key-value-list-item/key-value-list-item.vue'),
  MapChart: () => import('../components/chart/map-chart/map-chart.vue'),
  NetworkMap: () => import('../components/content/network-map/network-map.vue'),
  PlanFeatureList: () => import('../components/content/plan-feature-list/plan-feature-list.vue'),
  PricingCard: () => import('../components/content/pricing-card/pricing-card.vue'),
  Quote: () => import('../components/marketing/quote/quote.vue'),
  SparkChart: () => import('../components/chart/spark-chart/spark-chart.vue'),
  StatTile: () => import('../components/chart/stat-tile/stat-tile.vue'),
  StatTileGroup: () => import('../components/chart/stat-tile-group/stat-tile-group.vue'),
  Stats: () => import('../components/marketing/stats/stats.vue'),
  ThirdPartyLogo: () => import('../components/content/third-party-logo/third-party-logo.vue'),
  Tracker: () => import('../components/chart/tracker/tracker.vue')
} satisfies Record<string, ContentSceneLoader>

/** Name of a content component drawn from data, as a page entry or a Markdown tag spells it. */
export type ContentSceneName = keyof typeof loaders

export const contentScenes: Record<ContentSceneName, ContentSceneLoader> = loaders
