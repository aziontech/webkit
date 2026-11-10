import { toSfc } from '../../_shared/story-source'
import {
  SUMMARY_COMPONENTS,
  SUMMARY_TEMPLATE,
  summaryScript,
  summarySetup
} from './_executive-summary-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/ExecutiveSummaryDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'An executive summary dashboard: one page a lead reads to see how the quarter went. A page heading with the quarter Select and Export sits over a scorecard row of six StatTiles (revenue, monthly active users, net revenue retention, NPS, uptime and cost per request), each with its delta against last quarter and a Hint that defines it. Below, a trend grid of small multiples, one ChartCard per metric with a compact Chart (Area or Line) over the last 12 months and a Tag with the twelve-month change, shares one active index so hovering a month moves the crosshair on every card. A side column holds the goals, a CardBox of goal bars where each goal shows its label, a status Tag (On track, At risk, Off track), a ProgressBar of current against target and both figures, and the commentary, a CardBox of Item rows with the author Avatar, role, date and the note itself.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'executive summary',
        'executive dashboard',
        'scorecard',
        'quarterly report',
        'business kpis',
        'leadership dashboard',
        'resumo executivo',
        'painel executivo',
        'indicadores do trimestre'
      ],
      skills: ['webkit-data-viz', 'webkit-tables', 'webkit-ui-states']
    }
  }
}

export default meta

const story = (state) => ({
  components: SUMMARY_COMPONENTS,
  setup: summarySetup(state),
  template: SUMMARY_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'A closed quarter: every tile carries its delta, every goal its progress and status, every trend twelve months of data, and four leads have left a note.'
      },
      source: { code: toSfc(summaryScript('default'), SUMMARY_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the quarter loads, the tiles and charts render their own Skeleton and the goals and commentary hold Skeleton rows, so the page does not reflow when data arrives.'
      },
      source: { code: toSfc(summaryScript('loading'), SUMMARY_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'A quarter with nothing reported. The tiles show a dash with no delta, every trend card keeps its box with an EmptyState that names the quarter and points to a later one, and the goals and commentary each say what fills them.'
      },
      source: { code: toSfc(summaryScript('empty'), SUMMARY_TEMPLATE) }
    }
  }
}
