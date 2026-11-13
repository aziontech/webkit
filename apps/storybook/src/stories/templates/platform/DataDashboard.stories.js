import { toSfc } from '../../_shared/story-source'
import { components, scriptFor, setupFor, TEMPLATE } from './_data-dashboard'

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
  title: 'Templates/Platform/Dashboards/DataDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The data dashboard pattern: KPI tiles with sparklines and period-over-period deltas, followed by the breakdowns that explain them. Six StatTiles carry each metric’s period total, a sparkline and the change against the previous 24 hours, each with a Hint that defines the metric. Under them, a ChartCard draws data transferred this period over the previous one as two series, a labeled horizontal bar Chart ranks the projects by data transferred, and a searchable, paginated TableRoot lists requests and data transferred per project. Every card keeps its Sum and change Tags, an Expand IconButton and a Dropdown with Copy query and Export CSV. Built from `StatTile`, `ChartCard`, `Chart`, `TableRoot`, `Tag`, `Hint`, `SegmentedButton`, `IconButton`, `Tooltip`, `Dropdown`, `InputText` and `EmptyState`.'
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
  'No usage recorded yet: each tile shows a dash, and every chart and the table explain that nothing was recorded in the period.'
)
