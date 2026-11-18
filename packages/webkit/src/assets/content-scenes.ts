import type { Component } from 'vue'

/** Loads one content component drawn from data. */
export type ContentSceneLoader = () => Promise<{ default: Component }>

const loaders = {
  BarList: () => import('../components/chart/bar-list/bar-list.vue'),
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
  DonutChart: () => import('../components/chart/donut-chart/donut-chart.vue'),
  GaugeChart: () => import('../components/chart/gauge-chart/gauge-chart.vue'),
  MapChart: () => import('../components/chart/map-chart/map-chart.vue'),
  SparkChart: () => import('../components/chart/spark-chart/spark-chart.vue'),
  StatTile: () => import('../components/chart/stat-tile/stat-tile.vue'),
  StatTileGroup: () => import('../components/chart/stat-tile-group/stat-tile-group.vue'),
  Tracker: () => import('../components/chart/tracker/tracker.vue')
} satisfies Record<string, ContentSceneLoader>

/** Name of a content component drawn from data, as a page entry or a Markdown tag spells it. */
export type ContentSceneName = keyof typeof loaders

export const contentScenes: Record<ContentSceneName, ContentSceneLoader> = loaders
