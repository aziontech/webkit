import { toSfc } from '../../_shared/story-source'
import {
  TRAFFIC_COMPONENTS,
  TRAFFIC_TEMPLATE,
  trafficScript,
  trafficSetup
} from './_traffic-dashboard'

const meta = {
  title: 'Templates/Platform/Observe/TrafficDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Traffic view of the Dashboards page: a row of four StatTiles (requests, data transferred, cache hit ratio and status 5xx, each against the previous period) over a 12-column grid of ChartCards. Requests over time spans the grid, status codes and requests by country share a row, and the top hosts table closes it. Every card carries the same header: title with a Hint, the aggregation and variation Tags, a Line or Bar switch for time series, Expand, and a menu with Copy query and Export CSV.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state) => ({
  components: TRAFFIC_COMPONENTS,
  setup: trafficSetup(state),
  template: TRAFFIC_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'The populated view for the last 24 hours. Hovering one time series moves the crosshair on the other, because both cards share the active index.'
      },
      source: { code: toSfc(trafficScript('default'), TRAFFIC_TEMPLATE) }
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
      source: { code: toSfc(trafficScript('loading'), TRAFFIC_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'An account with no traffic in the period. The tiles show a dash with no delta or trend, and each card keeps its box with an EmptyState that says nothing was recorded.'
      },
      source: { code: toSfc(trafficScript('empty'), TRAFFIC_TEMPLATE) }
    }
  }
}
