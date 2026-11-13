import { toSfc } from '../../_shared/story-source'
import {
  FUNNEL_COMPONENTS,
  FUNNEL_TEMPLATE,
  funnelScript,
  funnelSetup
} from './_funnel-cohort-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/FunnelCohortDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A funnel and cohort dashboard: how people move through the steps from a first visit to a paid plan, and how well each weekly sign-up cohort is retained. The page opens with a heading and one global filter bar, a period and a segment `Select`, so every region renders the same slice. Below it, a row of five `StatTile`s (visitors, sign-ups, activated, paid and overall conversion, each against the previous period with a sparkline) sits over a 12-column grid of `ChartCard`s. The conversion funnel spans the grid: a horizontal, labeled `Chart.Bar` of the steps beside a `TableRoot` that states each step’s users, its share of visitors and the drop-off from the step before. Cohort retention shares the next row: a multi-series `Chart.Line` of retention by week since sign-up, one series per weekly cohort, and a cohort `TableRoot` with each cohort’s size and its week 1 to week 6 retention in tabular figures, where a dash marks a week that has not ended. There is no heatmap: the retention matrix is a plain table, not colored cells. Each card header carries a title with a `Hint` and a menu with Export CSV. Built from `Select`, `StatTile`, `ChartCard`, `Chart`, `TableRoot`, `EmptyState`, `Hint`, `Dropdown`, `IconButton` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state) => ({
  components: FUNNEL_COMPONENTS,
  setup: funnelSetup(state),
  template: FUNNEL_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'The populated view for the last 6 weeks across all users. The youngest cohorts have fewer completed weeks, so their lines end early and their later table cells show a dash. The sample data has nothing for Partner referrals: pick it to see the empty state.'
      },
      source: { code: toSfc(funnelScript('default'), FUNNEL_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the first response loads, every tile, both charts and both tables hold their place with a Skeleton, so the grid does not reflow when data arrives. The filter bar stays usable.'
      },
      source: { code: toSfc(funnelScript('loading'), FUNNEL_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'The filters match nothing. The tiles show a dash with no delta or trend, and each card keeps its box with an EmptyState that names the filters as the reason and offers Clear filters, which resets the period and the segment.'
      },
      source: { code: toSfc(funnelScript('empty'), FUNNEL_TEMPLATE) }
    }
  }
}
