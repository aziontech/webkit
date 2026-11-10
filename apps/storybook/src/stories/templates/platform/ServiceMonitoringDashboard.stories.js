import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'
import {
  components,
  DASHBOARD_TEMPLATE,
  dashboardScript,
  dashboardState,
  formatLatency,
  formatRate
} from './_service-monitoring-dashboard'

const story = (initial, description) => {
  const state = dashboardState(initial)
  return {
    render: () => ({
      components,
      setup: () => ({
        ...state,
        latencyWindow: ref('24h'),
        errorWindow: ref('24h'),
        formatLatency,
        formatRate
      }),
      template: DASHBOARD_TEMPLATE
    }),
    parameters: {
      docs: {
        description: { story: description },
        source: { code: toSfc(dashboardScript(state), DASHBOARD_TEMPLATE) }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Dashboards/ServiceMonitoringDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The service monitoring dashboard pattern: status tiles with sparklines, multi-series charts and an alert rail. One StatTile per service carries its p95 latency, the change against the previous period and a sparkline, with a StatusIndicator naming its state in words. Below, Latency (p50, p95, p99) and Error rate (Status 4xx, Status 5xx) sit in ChartCards as multi-series line Charts, each with its own window SegmentedButton, while an Open alerts rail holds the right edge: a fixed-width column that scrolls on its own, independent of the tiles and charts, listing each alert as an Item in an Item.Group with a severity Tag. Under the xl breakpoint the rail folds below the charts and the page scrolls as one. Built from `StatTile`, `StatusIndicator`, `ChartCard`, `Chart`, `SegmentedButton`, `Hint`, `Item`, `Tag`, `Skeleton` and `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  {},
  'Six services, one degraded and one down. Switch either chart between the last hour, six hours and 24 hours; the rail lists the four open alerts, most severe first.'
)

export const Loading = story(
  { loading: true },
  'The first load: every tile, both charts and the rail hold Skeletons, and the window switches stay usable.'
)

export const Empty = story(
  { empty: true },
  'No traffic yet: the tiles show a dash, both charts explain that metrics appear once a service serves requests, and the rail reads No open alerts.'
)
