import DonutChart from '@aziontech/webkit/donut-chart'

import { toSfc } from '../../../_shared/story-source'
import { COUNTRY_SLICES, declare } from '../_waf-data'

const IMPORT = "import DonutChart from '@aziontech/webkit/donut-chart'"
const SCRIPT = [IMPORT, '', declare('series', COUNTRY_SLICES)]

const meta = {
  title: 'Components/Chart/DonutChart',
  component: DonutChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A part-to-whole chart drawn as a ring or a disc: one slice per series, the total in the center, a legend beside it. It shares the chart palette, legend behavior and loading, empty and error surface. Six slices or fewer; the rest fold into Other.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    series: {
      control: 'object',
      description: 'One slice per series; a slice is the sum of its values.',
      table: {
        category: 'props',
        type: { summary: 'ChartSeries[]' },
        defaultValue: { summary: '[]' }
      }
    },
    kind: {
      control: 'select',
      options: ['donut', 'pie'],
      description: 'Ring or solid disc.',
      table: {
        category: 'props',
        type: { summary: "'donut' | 'pie'" },
        defaultValue: { summary: "'donut'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Diameter of the ring: 128, 176 or 240 pixels.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    cap: {
      control: 'number',
      description: 'Slices kept before the rest fold into Other.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '6' } }
    },
    otherLabel: {
      control: 'text',
      description: 'Name of the folded slice.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Other'" }
      }
    },
    totalLabel: {
      control: 'text',
      description: 'Caption under the total in the center.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Total'" }
      }
    },
    formatValue: {
      control: false,
      description: 'Formats the center value and legend values.',
      table: { category: 'props', type: { summary: '(value: number) => string' } }
    },
    loading: {
      control: 'boolean',
      description: 'Renders a circular Skeleton and suppresses interaction.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    refetching: {
      control: 'boolean',
      description: 'Holds the previous render at reduced opacity while new data loads.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    error: {
      control: 'text',
      description: 'Error message; when set, a danger Message replaces the ring.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    emptyTitle: {
      control: 'text',
      description: 'Title of the empty state shown when every slice is zero.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'No data available'" }
      }
    },
    tableView: {
      control: 'boolean',
      description: 'Shows the data table in place of the ring.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the chart.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    onSliceClick: {
      action: 'slice-click',
      description: 'Click on a slice, or Enter / Space on the focused chart.',
      table: {
        category: 'events',
        type: { summary: '(event: MouseEvent | KeyboardEvent, series: ChartSeries)' }
      }
    },
    onLegendToggle: {
      action: 'legend-toggle',
      description: 'A legend entry toggled.',
      table: { category: 'events', type: { summary: '(event: MouseEvent, series: ChartSeries)' } }
    },
    'onUpdate:activeIndex': {
      action: 'update:activeIndex',
      table: { category: 'events', type: { summary: 'number | null' } }
    },
    'onUpdate:hiddenSeries': {
      action: 'update:hiddenSeries',
      table: { category: 'events', type: { summary: 'string[]' } }
    },
    center: {
      control: false,
      description: 'Replaces the center readout; receives the total and the active series.',
      table: {
        category: 'slots',
        type: { summary: '{ total: number; active: ChartSeries | null }' }
      }
    }
  },
  args: {
    series: COUNTRY_SLICES,
    kind: 'donut',
    size: 'medium',
    totalLabel: 'Blocked threats',
    loading: false,
    ariaLabel: 'Top WAF threat requests by country'
  }
}

export default meta

const Template = (args) => ({
  components: { DonutChart },
  setup: () => ({ args }),
  template: '<DonutChart v-bind="args" />'
})

const DEFAULT_MARKUP = `<DonutChart
  :series="series"
  total-label="Blocked threats"
  aria-label="Top WAF threat requests by country"
/>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Blocked threats by country. Hover a slice, or focus the ring and use the arrow keys, to swap the center to that country.'
      },
      source: { code: toSfc(SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap gap-(--spacing-xl)">
  <DonutChart :series="series" kind="donut" total-label="Blocked threats" aria-label="Donut" />
  <DonutChart :series="series" kind="pie" aria-label="Pie" />
</div>`

export const Types = {
  render: () => ({
    components: { DonutChart },
    setup: () => ({ series: COUNTRY_SLICES }),
    template: TYPES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'A ring with the total in the center, and a solid disc with no center readout.'
      },
      source: { code: toSfc(SCRIPT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <DonutChart :series="series" size="small" aria-label="Small" />
  <DonutChart :series="series" size="medium" aria-label="Medium" />
  <DonutChart :series="series" size="large" aria-label="Large" />
</div>`

export const Sizes = {
  render: () => ({
    components: { DonutChart },
    setup: () => ({ series: COUNTRY_SLICES }),
    template: SIZES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Ring diameters of 128, 176 and 240 pixels.' },
      source: { code: toSfc(SCRIPT, SIZES_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: Template,
  args: { loading: true },
  parameters: {
    docs: {
      description: { story: 'A circular Skeleton the size of the ring.' },
      source: {
        code: toSfc(
          SCRIPT,
          '<DonutChart :series="series" loading aria-label="Top WAF threat requests by country" />'
        )
      }
    }
  }
}

const EMPTY_SERIES = [{ id: 'none', name: 'Blocked threats', values: [0] }]

export const Empty = {
  render: Template,
  args: { series: EMPTY_SERIES },
  parameters: {
    docs: {
      description: { story: 'Every slice is zero, so an EmptyState takes the ring.' },
      source: {
        code: toSfc(
          [IMPORT, '', declare('series', EMPTY_SERIES)],
          '<DonutChart :series="series" aria-label="Top WAF threat requests by country" />'
        )
      }
    }
  }
}
