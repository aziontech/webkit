import Button from '@aziontech/webkit/button'
import Chart, {
  ChartArea,
  ChartAxis,
  ChartBar,
  ChartCrosshair,
  ChartGrid,
  ChartLegend,
  ChartLine,
  ChartTooltip
} from '@aziontech/webkit/chart'

import { toSfc } from '../../../_shared/story-source'
import {
  COUNTRY_BARS,
  COUNTRY_LABELS,
  declare,
  HOSTS,
  LABELS,
  THREATS_VS_REQUESTS
} from '../_waf-data'

const IMPORT = "import Chart from '@aziontech/webkit/chart'"

const components = {
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
  'Chart.Area': ChartArea,
  'Chart.Bar': ChartBar,
  'Chart.Crosshair': ChartCrosshair,
  'Chart.Tooltip': ChartTooltip,
  'Chart.Legend': ChartLegend
}

const data = { labels: LABELS, series: THREATS_VS_REQUESTS }
const script = (...lines) => [IMPORT, '', ...lines]
const THREATS_SCRIPT = script(declare('labels', LABELS), declare('series', THREATS_VS_REQUESTS))

const meta = {
  title: 'Components/Chart/Chart',
  component: Chart,
  subcomponents: {
    ChartGrid,
    ChartAxis,
    ChartLine,
    ChartArea,
    ChartBar,
    ChartCrosshair,
    ChartTooltip,
    ChartLegend
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A cartesian chart, lines, areas and bars over one category axis, composed from parts placed by hand. The root owns the series, the scales, hover and keyboard, and the loading, empty and error surface; every part reads that state through context. Colors come from the --chart-* role, so a chart re-themes with no per-theme code.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    series: {
      control: 'object',
      description:
        'Series to plot. The first six take the fixed categorical slots in order; the rest fold into Other.',
      table: {
        category: 'props',
        type: { summary: 'ChartSeries[]' },
        defaultValue: { summary: '[]' }
      }
    },
    labels: {
      control: 'object',
      description: 'One category label per index: a string, a number, or a Date.',
      table: {
        category: 'props',
        type: { summary: 'ChartLabel[]' },
        defaultValue: { summary: '[]' }
      }
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description:
        'Value axis direction. Horizontal lays categories down the side, for ordered bars.',
      table: {
        category: 'props',
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: "'vertical'" }
      }
    },
    min: {
      control: 'number',
      description: 'Floor of the value axis. Marks grow from one baseline.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    max: {
      control: 'number',
      description: 'Ceiling of the value axis. When absent, the nice ceiling of the visible data.',
      table: { category: 'props', type: { summary: 'number' } }
    },
    cap: {
      control: 'number',
      description: 'Series kept before the rest fold into Other.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '6' } }
    },
    otherLabel: {
      control: 'text',
      description: 'Name of the folded series.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Other'" }
      }
    },
    formatValue: {
      control: false,
      description: 'Formats ticks, tooltip values and legend totals.',
      table: { category: 'props', type: { summary: '(value: number) => string' } }
    },
    formatLabel: {
      control: false,
      description: 'Formats category labels on the axis and in the tooltip.',
      table: { category: 'props', type: { summary: '(label: ChartLabel) => string' } }
    },
    height: {
      control: 'number',
      description: 'Minimum plot height in pixels; the plot grows to fill a taller container.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '240' } }
    },
    loading: {
      control: 'boolean',
      description: 'Renders a Skeleton sized to the plot and suppresses interaction.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    refetching: {
      control: 'boolean',
      description: 'Holds the previous render at reduced opacity while new data loads.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    error: {
      control: 'text',
      description: 'Error message; when set, the plot renders a danger Message instead of marks.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    emptyTitle: {
      control: 'text',
      description: 'Title of the empty state shown when no series has a value.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'No data available'" }
      }
    },
    emptyDescription: {
      control: 'text',
      description:
        'Supporting line under the empty title: why the range is empty, or what to do next.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    tableView: {
      control: 'boolean',
      description:
        'Shows the data table in place of the marks. The table is always present for assistive tech.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the chart when it is not inside a ChartCard with a title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    activeIndex: {
      control: 'number',
      description: 'v-model:activeIndex — the category index under the pointer or keyboard focus.',
      table: {
        category: 'v-model',
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' }
      }
    },
    hiddenSeries: {
      control: 'object',
      description: 'v-model:hiddenSeries — ids of series the legend has hidden.',
      table: { category: 'v-model', type: { summary: 'string[]' }, defaultValue: { summary: '[]' } }
    },
    onPointClick: {
      action: 'point-click',
      description: 'Click on the plot, or Enter / Space on the focused chart, at the active index.',
      table: {
        category: 'events',
        type: { summary: '(event: MouseEvent | KeyboardEvent, point: ChartPoint)' }
      }
    },
    onLegendToggle: {
      action: 'legend-toggle',
      description: 'A legend entry toggled; the payload is the consumer series object.',
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
    default: {
      control: false,
      description:
        'The parts: Grid, Axis, Line, Area, Bar, Crosshair, Tooltip, Legend, in paint order.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    empty: {
      control: false,
      description: 'Replaces the default EmptyState.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    'empty-actions': {
      control: false,
      description:
        'Actions under the default EmptyState, such as a Clear filters button or a setup link.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    series: THREATS_VS_REQUESTS,
    labels: LABELS,
    orientation: 'vertical',
    loading: false,
    refetching: false,
    error: '',
    tableView: false,
    ariaLabel: 'Threats vs requests'
  }
}

export default meta

const PARTS = `
  <Chart.Grid />
  <Chart.Axis kind="y" />
  <Chart.Axis kind="x" />
  <Chart.Area :ids="['allowed']" />
  <Chart.Line :ids="['blocked', 'threat']" />
  <Chart.Crosshair />
  <Chart.Tooltip />
  <Chart.Legend totals />`

const Template = (args) => ({
  components,
  setup: () => ({ args }),
  template: `<Chart v-bind="args">${PARTS}
</Chart>`
})

const markup = (attrs) => `<Chart :series="series" :labels="labels"${attrs}>${PARTS}
</Chart>`

const DEFAULT_MARKUP = markup(' aria-label="Threats vs requests"')

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Threats vs requests chart: allowed requests as an area, blocked and logged threats as lines. Each series means a state, so it wears a status color. Hover, or focus the plot and use the arrow keys, to read every series at one point.'
      },
      source: { code: toSfc(THREATS_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const FORMS_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-3">
  <Chart :series="series" :labels="labels" aria-label="Threats as lines">
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" :ticks="4" />
    <Chart.Line />
    <Chart.Crosshair />
    <Chart.Tooltip />
  </Chart>
  <Chart :series="series" :labels="labels" aria-label="Threats as areas">
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" :ticks="4" />
    <Chart.Area />
    <Chart.Crosshair />
    <Chart.Tooltip />
  </Chart>
  <Chart :series="series" :labels="labels" aria-label="Threats as bars">
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" :ticks="4" />
    <Chart.Bar />
    <Chart.Tooltip />
  </Chart>
</div>`

export const Forms = {
  render: () => ({ components, setup: () => data, template: FORMS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same three series as lines, as areas and as grouped bars. Lines and areas share a point scale; any bar switches the category axis to bands so every mark sits on a band center.'
      },
      source: { code: toSfc(THREATS_SCRIPT, FORMS_TEMPLATE) }
    }
  }
}

const STACKED_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
  <Chart :series="series" :labels="labels" aria-label="Requests stacked as areas">
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Area stacked />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend />
  </Chart>
  <Chart :series="series" :labels="labels" aria-label="Requests stacked as bars">
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Bar stacked />
    <Chart.Tooltip />
    <Chart.Legend />
  </Chart>
</div>`

export const Stacked = {
  render: () => ({ components, setup: () => data, template: STACKED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Parts of a total over time. Stacked bars keep a 2px surface gap between segments and round only the top of each column.'
      },
      source: { code: toSfc(THREATS_SCRIPT, STACKED_TEMPLATE) }
    }
  }
}

const MULTI_TEMPLATE = `<Chart :series="hosts" :labels="labels" aria-label="WAF threat requests by host">
  <Chart.Grid />
  <Chart.Axis kind="y" />
  <Chart.Axis kind="x" />
  <Chart.Line />
  <Chart.Crosshair />
  <Chart.Tooltip />
  <Chart.Legend totals />
</Chart>`

export const MultiSeries = {
  render: () => ({
    components,
    setup: () => ({ labels: LABELS, hosts: HOSTS }),
    template: MULTI_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Eight hosts. The first six take the six series slots in order and the last two fold into Other, so no hue is ever generated or reused. Toggle a host in the legend: the others keep their colors.'
      },
      source: {
        code: toSfc(script(declare('labels', LABELS), declare('hosts', HOSTS)), MULTI_TEMPLATE)
      }
    }
  }
}

const HORIZONTAL_TEMPLATE = `<Chart :series="series" :labels="countries" orientation="horizontal" aria-label="Top WAF threat requests by country">
  <Chart.Grid />
  <Chart.Axis kind="y" />
  <Chart.Bar labeled />
  <Chart.Tooltip />
</Chart>`

export const Horizontal = {
  render: () => ({
    components,
    setup: () => ({ series: COUNTRY_BARS, countries: COUNTRY_LABELS }),
    template: HORIZONTAL_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Ordered horizontal bars with the value at each bar end, the form for a top-N list. One series means one color for every bar; bar length already carries the magnitude.'
      },
      source: {
        code: toSfc(
          script(declare('countries', COUNTRY_LABELS), declare('series', COUNTRY_BARS)),
          HORIZONTAL_TEMPLATE
        )
      }
    }
  }
}

const stateStory = (prop, value, attrs, story) => ({
  render: Template,
  args: { [prop]: value },
  parameters: {
    docs: {
      description: { story },
      source: { code: toSfc(THREATS_SCRIPT, markup(` aria-label="Threats vs requests"${attrs}`)) }
    }
  }
})

export const Loading = {
  ...stateStory(
    'loading',
    true,
    ' loading',
    'A Skeleton fills the plot while the first response loads.'
  )
}

const EMPTY_SERIES = [{ id: 'xss', name: 'WAF requests XSS attacks', values: [null, null, null] }]

const EMPTY_PARTS = `
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Line />`

const EMPTY_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-3">
  <Chart
    :series="series"
    :labels="labels"
    aria-label="Cross-site scripting threats"
    empty-title="No requests in this range"
    empty-description="Nothing reached this workload in the last hour."
  >${EMPTY_PARTS}
  </Chart>
  <Chart
    :series="series"
    :labels="labels"
    aria-label="Cross-site scripting threats"
    empty-title="No requests match these filters"
    empty-description="Choose another host or widen the time range."
  >${EMPTY_PARTS}
    <template #empty-actions>
      <Button label="Clear filters" kind="outlined" size="small" />
    </template>
  </Chart>
  <Chart
    :series="series"
    :labels="labels"
    aria-label="Cross-site scripting threats"
    empty-title="No firewall on this workload"
    empty-description="Threat metrics appear once a firewall protects the workload."
  >${EMPTY_PARTS}
    <template #empty-actions>
      <Button label="Add firewall" kind="secondary" size="small" icon="pi pi-plus" />
    </template>
  </Chart>
</div>`

export const Empty = {
  render: () => ({
    components: { ...components, Button },
    setup: () => ({ labels: LABELS, series: EMPTY_SERIES }),
    template: EMPTY_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'No series has a value, so the plot renders an EmptyState at full plot height and the dashboard keeps its rhythm. Name the reason in the copy: nothing in the range, filters that match nothing (offer Clear filters), or a source that is not set up yet (offer the setup action).'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import Button from '@aziontech/webkit/button'",
            '',
            declare('labels', LABELS),
            declare('series', EMPTY_SERIES)
          ],
          EMPTY_TEMPLATE
        )
      }
    }
  }
}

export const ErrorState = {
  name: 'Error',
  ...stateStory(
    'error',
    'Could not load this report.',
    ' error="Could not load this report."',
    'The request failed. A danger Message takes the plot; the card around it keeps its title and controls.'
  )
}

export const Refetching = {
  ...stateStory(
    'refetching',
    true,
    ' refetching',
    'A new range is loading. The previous render holds at reduced opacity instead of flashing a skeleton.'
  )
}

export const TableView = {
  ...stateStory(
    'tableView',
    true,
    ' table-view',
    'The accessible twin of the chart, made visible: every label by every series. It is always present for assistive tech.'
  )
}
