import { toSfc } from '../../_shared/story-source'
import {
  ANALYTICS_COMPONENTS,
  ANALYTICS_TEMPLATE,
  analyticsScript,
  analyticsSetup
} from './_analytics-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/AnalyticsDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The analytics dashboard pattern: KPI tiles, charts and a table that all read the same period, so one change of range moves every region together. A row of four StatTiles (requests, data transferred, success rate and status 5xx, each with a sparkline and its change against the previous period) sits over a 12-column grid of ChartCards. Requests over time spans the grid as an area Chart, status codes as a multi-series line and requests by country as labeled horizontal bars share a row, and a searchable, paginated TableRoot of top hosts closes it. Every card carries the same header: title with a Hint, the aggregation and variation Tags, a Line or Bar SegmentedButton for time series, an Expand IconButton, and a Dropdown with Copy query and Export CSV. Built from `StatTile`, `ChartCard`, `Chart`, `TableRoot`, `Tag`, `Hint`, `SegmentedButton`, `IconButton`, `Tooltip`, `Dropdown`, `InputText` and `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'metrics',
        'metric panel',
        'kpi tiles',
        'sparkline',
        'real-time metrics',
        'analytics dashboard',
        'painel de métricas',
        'indicadores',
        'analytics',
        'traffic analytics',
        'requests over time',
        'period comparison',
        'painel analítico',
        'análise de tráfego'
      ],
      skills: ['webkit-data-viz', 'webkit-tables', 'webkit-ui-states']
    }
  }
}

export default meta

const story = (state) => ({
  components: ANALYTICS_COMPONENTS,
  setup: analyticsSetup(state),
  template: ANALYTICS_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'The populated view for the last 24 hours. Hovering one time series moves the crosshair on the other, because both cards share the active index.'
      },
      source: { code: toSfc(analyticsScript('default'), ANALYTICS_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the first response loads, every tile, chart and the table hold their place with a Skeleton, so the grid does not reflow when data arrives.'
      },
      source: { code: toSfc(analyticsScript('loading'), ANALYTICS_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'No traffic in the period. The tiles show a dash with no delta or trend, and each card keeps its box with an EmptyState that says nothing was recorded.'
      },
      source: { code: toSfc(analyticsScript('empty'), ANALYTICS_TEMPLATE) }
    }
  }
}
