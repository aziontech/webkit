import { ref } from 'vue'

import { toSfc } from '../../_shared/story-source'
import {
  components,
  DASHBOARD_TEMPLATE,
  dashboardScript,
  dashboardState,
  formatLatency,
  formatRate
} from './_edge-health-dashboard'

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
  title: 'Templates/Platform/Observe/EdgeHealthDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Edge health view of the Dashboards page. One StatTile per workload carries its p95 latency, the change against the previous period and a sparkline, with a StatusIndicator naming its state in words. Below, Latency (p50, p95, p99) and Error rate (Status 4xx, Status 5xx) sit in ChartCards, each with its own window switch, beside an Open alerts rail built from Item rows and severity Tags. The rail folds below the charts under the xl breakpoint.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  {},
  'Six workloads, one degraded and one down. Switch either chart between the last hour, six hours and 24 hours; the rail lists the four open alerts, most severe first.'
)

export const Loading = story(
  { loading: true },
  'The first load: every tile, both charts and the rail hold Skeletons, and the window switches stay usable.'
)

export const Empty = story(
  { empty: true },
  'A workspace with no traffic yet: the tiles show a dash, both charts explain that metrics appear once a workload serves requests, and the rail reads No open alerts.'
)
