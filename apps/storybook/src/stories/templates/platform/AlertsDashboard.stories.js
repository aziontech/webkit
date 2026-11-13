import { toSfc } from '../../_shared/story-source'
import { ALERTS_COMPONENTS, ALERTS_TEMPLATE, alertsScript, alertsSetup } from './_alerts-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/AlertsDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'An alerts dashboard: what is open, how severe it is, what kind it is and who is involved. A page heading with the period Select sits over four StatTiles (open, critical or high open, alerts in the period and the false positive rate), each with its delta and a Hint. Below, a ChartCard stacks the alerts raised each day by severity level, with every series colored from the severity ramp so the bars, the legend and the tooltip read the same scale as the tables. Beside it, Open by severity lists one SeverityTag per level with its open count and its share of the open alerts. A BarList ranks the alerts by type, the Highest risk table pairs each entity with its risk score and the SeverityTag of its worst open alert, and the Open alerts table leads every row with its SeverityTag, sortable from critical to info.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state) => ({
  components: ALERTS_COMPONENTS,
  setup: alertsSetup(state),
  template: ALERTS_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'Thirty days of alerts with a surge three days ago: the tiles carry their deltas, every severity level has open alerts and six entities carry risk.'
      },
      source: { code: toSfc(alertsScript('default'), ALERTS_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the period loads, the tiles, the chart, the bar list and both tables render their own Skeleton, and Open by severity holds Skeleton rows, so nothing reflows when data arrives.'
      },
      source: { code: toSfc(alertsScript('loading'), ALERTS_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'A period with no alerts. The tiles show a dash with no delta, and every region keeps its box with an EmptyState that says why it is empty and what to do next.'
      },
      source: { code: toSfc(alertsScript('empty'), ALERTS_TEMPLATE) }
    }
  }
}
