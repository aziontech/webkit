import { toSfc } from '../../_shared/story-source'
import { SCAN_COMPONENTS, SCAN_TEMPLATE, scanScript, scanSetup } from './_scan-results-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/ScanResultsDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A scan results dashboard: items sent for analysis, the verdict each one received and what is still waiting. A page heading with a Refresh IconButton sits over a row of six StatTiles (submitted, in analysis, last 24 hours, flagged, held for a verdict and open alerts), each with a Hint that defines it. Below, three cards share a row: a DonutChart of the verdicts (Clean, Suspicious, Flagged and Pending, in their status hues) with the item count in its center, a BarList of the sources the items came from, and a CardBox that sums up the deliveries held for a verdict and the items delivered before they were flagged, each with a Link to its list. A Submissions card across the full width holds the filter row (an InputText search and Selects for status, verdict and source) over a paginated TableRoot: name, the verdict Tag, category, score, type, size, source, first submitter and last seen. Built from `StatTile`, `DonutChart`, `BarList`, `ChartCard`, `CardBox`, `TableRoot`, `Tag`, `Link`, `InputText`, `Select`, `Hint`, `IconButton`, `Skeleton` and `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const story = (state) => ({
  components: SCAN_COMPONENTS,
  setup: scanSetup(state),
  template: SCAN_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'A busy period: most items came back clean, a few were flagged or suspicious, some are still in analysis, and a handful of deliveries are held for their verdict.'
      },
      source: { code: toSfc(scanScript('default'), SCAN_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the results load, the tiles, the donut and the bar list render their own Skeleton, the summary holds Skeleton lines and the table shows Skeleton rows, so the page does not reflow when data arrives.'
      },
      source: { code: toSfc(scanScript('loading'), SCAN_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'Nothing has been sent for analysis yet. The tiles read zero, the verdicts and sources keep their box with an EmptyState, and the Submissions card drops the filters and the table for one EmptyState that says what fills it.'
      },
      source: { code: toSfc(scanScript('empty'), SCAN_TEMPLATE) }
    }
  }
}
