import { toSfc } from '../../_shared/story-source'
import { components, securityScript, securityState, securityTemplate } from './_security-dashboard'

const story = (state, description) => ({
  render: () => ({
    components,
    setup: () => securityState(state),
    template: securityTemplate(state)
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(securityScript(state), securityTemplate(state)) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Dashboards/SecurityDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The security dashboard pattern: blocked and allowed requests over time, breakdowns by attack category and origin, the top sources and an attention list. A row of three StatTiles (Requests blocked, Requests inspected, Block rate, each with its delta against the previous period and a sparkline) sits over a 12-column grid of ChartCards. Matched requests over time plots blocked and logged requests; Needs attention lists the settings and traffic that ask for a decision, each with a severity Tag and one action Link; attack categories and countries read as ranked BarLists, and the top source IPs as a searchable, paginated TableRoot. With no rule set in place the tiles stay as dashes and one setup EmptyState that offers Add rule set replaces the grid. Built from `StatTile`, `ChartCard`, `Chart`, `BarList`, `Item`, `Tag`, `Link`, `TableRoot`, `Hint`, `SegmentedButton`, `Dropdown`, `Skeleton`, `EmptyState` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  'default',
  'The last 24 hours: blocked requests up against the previous period, three items that need attention, and the breakdowns by attack category, country and source IP.'
)

export const Loading = story(
  'loading',
  'The first load: every tile, chart and the table hold a Skeleton, and Needs attention shows three placeholder rows.'
)

export const Empty = story(
  'empty',
  'No security rules set up yet: the tiles read as dashes, and one bordered EmptyState names the reason and offers Add rule set instead of a grid of empty charts.'
)
