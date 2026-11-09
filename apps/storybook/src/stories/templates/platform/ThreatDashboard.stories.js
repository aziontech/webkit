import { toSfc } from '../../_shared/story-source'
import { components, threatScript, threatState, threatTemplate } from './_threat-dashboard'

const story = (state, description) => ({
  render: () => ({
    components,
    setup: () => threatState(state),
    template: threatTemplate(state)
  }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(threatScript(state), threatTemplate(state)) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Observe/ThreatDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Threats view of the console Dashboards page (`/dashboards?view=threats`): a row of three StatTiles (Threats blocked, Requests inspected, Block rate, each with its delta against the previous period and a sparkline) over a 12-column grid of ChartCards. Threats over time plots blocked and logged threats; Needs attention lists the settings and traffic that ask for a decision, each with a severity Tag and one action Link; attack families read as ordered horizontal bars, countries as a pie, and the top source IPs as a searchable, paginated TableRoot. An account with no firewall keeps the tiles as dashes and replaces the grid with one setup EmptyState that offers Add firewall.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  'default',
  'The last 24 hours: blocked threats up against the previous period, three items that need attention, and the breakdowns by attack family, country and source IP.'
)

export const Loading = story(
  'loading',
  'The first load: every tile, chart and the table hold a Skeleton, and Needs attention shows three placeholder rows.'
)

export const Empty = story(
  'empty',
  'An account with no firewall yet: the tiles read as dashes, and one bordered EmptyState names the reason and offers Add firewall instead of a grid of empty charts.'
)
