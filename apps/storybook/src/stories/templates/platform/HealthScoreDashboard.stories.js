import { toSfc } from '../../_shared/story-source'
import {
  HEALTH_COMPONENTS,
  HEALTH_TEMPLATE,
  healthScript,
  healthSetup
} from './_health-score-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/HealthScoreDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A health score dashboard: how well something performs for the people who use it, read as one score out of 100 and its bands. A page heading with the period Select sits over the overall score, a ChartCard with the figure, its band Tag (Good at 80 or more, Fair from 50 to 79, Poor under 50), the top cause of poor samples and a Line Chart of the score per hour. Two ChartCards rank the score per application and per location in a BarList, lowest first, each row naming its top cause. An hourly score card gives every application a Tracker strip, one block per hour colored by band, with its current band Tag at the end of the row. Under the grid, a CardBox lists the open incidents as Item rows: what is affected, the cause, how many devices and what share of samples, when it opened, and its band.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'health score',
        'health dashboard',
        'performance score',
        'web vitals',
        'score bands',
        'quality score',
        'pontuação de saúde',
        'painel de saúde',
        'nota de desempenho'
      ],
      skills: ['webkit-data-viz', 'webkit-ui-states']
    }
  }
}

export default meta

const story = (state) => ({
  components: HEALTH_COMPONENTS,
  setup: healthSetup(state),
  template: HEALTH_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'A working day: the score dips through business hours, two applications and one location fall to fair or poor, and three incidents are still open.'
      },
      source: { code: toSfc(healthScript('default'), HEALTH_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the period loads, the chart, the rankings and the trackers render their own Skeleton and the incidents hold Skeleton rows, so the page does not reflow when data arrives.'
      },
      source: { code: toSfc(healthScript('loading'), HEALTH_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'A period with no samples. The score shows a dash with no band, and every region keeps its box with an empty state that names the period and says what fills it.'
      },
      source: { code: toSfc(healthScript('empty'), HEALTH_TEMPLATE) }
    }
  }
}
