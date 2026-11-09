import { toSfc } from '../../_shared/story-source'
import { components, scriptFor, setupFor, TEMPLATE } from './_usage-dashboard'

const story = (state, description) => ({
  render: () => ({ components, setup: setupFor(state), template: TEMPLATE }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(state), TEMPLATE) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Observe/UsageDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Usage view of the Dashboards page: every billed metric set against the previous period. Six StatTiles carry the period total, a sparkline and the change against the previous 24 hours, each with a Hint that defines the metric. Under them, ChartCards hold data transferred this period drawn over the previous one, the workloads ranked by data transferred, and a searchable, paginated TableRoot of requests and data transferred per workload. Every card keeps its Sum and change Tags, an Expand control and a Copy query or Export CSV menu.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  'default',
  'The last 24 hours: data transferred rose against the previous period, so its tile and the comparison chart read the same change.'
)

export const Loading = story(
  'loading',
  'The first response is on its way: Skeletons hold every tile, chart and table row in place.'
)

export const Empty = story(
  'empty',
  'An account with no traffic yet: each tile shows a dash, and every chart and the table explain that nothing was recorded in the period.'
)
