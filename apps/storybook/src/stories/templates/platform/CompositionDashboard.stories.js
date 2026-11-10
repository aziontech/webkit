import { toSfc } from '../../_shared/story-source'
import {
  COMPOSITION_COMPONENTS,
  COMPOSITION_TEMPLATE,
  compositionScript,
  compositionSetup
} from './_composition-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/CompositionDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A composition dashboard: how a total breaks down into its parts and how that mix moved over time, here the organization’s monthly spend by category. Under a page heading with the period Select and an Export button sits a row of four StatTiles, the total first and then its three largest categories, each with the change against the previous month and a 12-month sparkline; a rise reads as bad, so every tile is `inverse`. Below, a 12-column grid of ChartCards: the stacked Chart of spend by category over 12 months (Area or Bar from a SegmentedButton, crosshair, one tooltip for every category, a legend with range totals) beside a DonutChart of the current month’s split with the total in its center, and a ranked contributors TableRoot across the full width: rank, the resource name behind its category glyph, the category Tag, the amount, its share of the total as a ProgressBar with the percentage, and the change against last month as a Tag. Built from `StatTile`, `Chart`, `DonutChart`, `ChartCard`, `TableRoot`, `Tag`, `ProgressBar`, `Hint`, `SegmentedButton`, `Select`, `Dropdown`, `IconButton`, `Button` and `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'composition dashboard',
        'spend breakdown',
        'cost by category',
        'donut chart dashboard',
        'stacked area chart',
        'top contributors',
        'mix over time',
        'painel de composição',
        'gastos por categoria',
        'custos por categoria'
      ],
      skills: ['webkit-data-viz', 'webkit-tables', 'webkit-ui-states']
    }
  }
}

export default meta

const story = (state) => ({
  components: COMPOSITION_COMPONENTS,
  setup: compositionSetup(state),
  template: COMPOSITION_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'Twelve months of spend across five categories and the ten resources that cost the most this month. Switch the trend to Bar to stack the categories as columns; sort the table by amount, share or change.'
      },
      source: { code: toSfc(compositionScript('default'), COMPOSITION_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the first response loads, every tile, both charts and the table hold their place with a Skeleton, so the grid does not reflow when data arrives.'
      },
      source: { code: toSfc(compositionScript('loading'), COMPOSITION_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'Nothing was billed in the selected period. The tiles show a dash with no delta or trend, and the stacked chart, the donut and the table each keep their box with an EmptyState that names the reason.'
      },
      source: { code: toSfc(compositionScript('empty'), COMPOSITION_TEMPLATE) }
    }
  }
}
