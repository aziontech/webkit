import type { HomeDashboardMetricId } from './dashboard-home.vue'

/** The fixed part of one usage tile. */
export interface HomeMetricDefinition {
  /** The tile key. */
  id: HomeDashboardMetricId
  /** The tile label. */
  label: string
  /** The unit after the figure. */
  unit: string
  /** One sentence that defines the figure. */
  hint: string
}

export const homeMetricDefinitions: HomeMetricDefinition[] = [
  {
    label: 'Data transferred',
    id: 'data-transferred',
    unit: 'GB',
    hint: 'Total bytes delivered across all your resources.'
  },
  {
    label: 'Requests per second',
    id: 'requests-per-second',
    unit: '/s',
    hint: 'Average requests handled per second in the selected window.'
  },
  {
    label: 'Bandwidth saving',
    id: 'bandwidth-saving',
    unit: 'GB',
    hint: 'Bytes served from cache instead of your origin.'
  },
  {
    label: 'Data offload',
    id: 'data-offload',
    unit: '%',
    hint: 'Share of traffic served from cache instead of your origin.'
  }
]
