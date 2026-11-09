import Chart, {
  ChartAxis,
  ChartCrosshair,
  ChartGrid,
  ChartLegend,
  ChartLine,
  ChartTooltip
} from '@aziontech/webkit/chart'
import ChartCard, {
  ChartCardContent,
  ChartCardControls,
  ChartCardDescription,
  ChartCardDragHandle,
  ChartCardFooter,
  ChartCardHeader,
  ChartCardResizeHandle,
  ChartCardTitle
} from '@aziontech/webkit/chart-card'
import Dropdown, {
  DropdownGroup,
  DropdownOption,
  DropdownTrigger
} from '@aziontech/webkit/dropdown'
import IconButton from '@aziontech/webkit/icon-button'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'
import { declare, HOSTS, LABELS, THREATS_VS_REQUESTS, XSS_THREATS } from '../_waf-data'

const IMPORT = "import ChartCard from '@aziontech/webkit/chart-card'"
const CHART_IMPORT = "import Chart from '@aziontech/webkit/chart'"

const components = {
  ChartCard,
  'ChartCard.Header': ChartCardHeader,
  'ChartCard.Title': ChartCardTitle,
  'ChartCard.Description': ChartCardDescription,
  'ChartCard.Controls': ChartCardControls,
  'ChartCard.DragHandle': ChartCardDragHandle,
  'ChartCard.Content': ChartCardContent,
  'ChartCard.Footer': ChartCardFooter,
  'ChartCard.ResizeHandle': ChartCardResizeHandle,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
  'Chart.Crosshair': ChartCrosshair,
  'Chart.Tooltip': ChartTooltip,
  'Chart.Legend': ChartLegend,
  Dropdown,
  DropdownTrigger,
  DropdownGroup,
  DropdownOption,
  IconButton,
  Tag
}

const THREATS_SCRIPT = [
  IMPORT,
  CHART_IMPORT,
  '',
  declare('labels', LABELS),
  declare('series', THREATS_VS_REQUESTS)
]

const CHART = `<Chart :series="series" :labels="labels">
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Line />
      <Chart.Crosshair />
      <Chart.Tooltip />
      <Chart.Legend totals />
    </Chart>`

const meta = {
  title: 'Components/Chart/ChartCard',
  component: ChartCard,
  subcomponents: {
    ChartCardHeader,
    ChartCardTitle,
    ChartCardDescription,
    ChartCardControls,
    ChartCardDragHandle,
    ChartCardContent,
    ChartCardFooter,
    ChartCardResizeHandle
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The box a dashboard chart lives in: a header with the title and a controls zone, a description, a content area padded or flush, an optional footer, and two optional handles to move and resize the card on a dashboard grid. Span and height are two-way models applied through custom properties; the reorder state stays with the page that owns the grid.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    draggable: {
      control: 'boolean',
      description: 'Shows the drag handle and lets the card be dragged to a new position.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    resizable: {
      control: 'boolean',
      description: 'Shows the resize handle.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    minSpan: {
      control: 'number',
      description: 'Fewest grid columns the card may span.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '3' } }
    },
    maxSpan: {
      control: 'number',
      description: 'Most grid columns the card may span.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '12' } }
    },
    minHeight: {
      control: 'number',
      description: 'Smallest height in pixels the resize handle allows.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '240' } }
    },
    maxHeight: {
      control: 'number',
      description: 'Largest height in pixels the resize handle allows.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '960' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the card when it has no title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    span: {
      control: 'number',
      description: 'v-model:span — grid columns the card spans.',
      table: { category: 'v-model', type: { summary: 'number' }, defaultValue: { summary: '6' } }
    },
    height: {
      control: 'number',
      description: 'v-model:height — height in pixels; absent means the content decides.',
      table: { category: 'v-model', type: { summary: 'number | undefined' } }
    },
    onMove: {
      action: 'move',
      description: 'An arrow key on the drag handle.',
      table: {
        category: 'events',
        type: { summary: "(event: KeyboardEvent, direction: 'up' | 'down' | 'left' | 'right')" }
      }
    },
    onDragStart: {
      action: 'drag-start',
      table: { category: 'events', type: { summary: '(event: DragEvent)' } }
    },
    onDragEnd: {
      action: 'drag-end',
      table: { category: 'events', type: { summary: '(event: DragEvent)' } }
    },
    onResizeStart: {
      action: 'resize-start',
      table: { category: 'events', type: { summary: '(event: PointerEvent)' } }
    },
    onResizeEnd: {
      action: 'resize-end',
      table: { category: 'events', type: { summary: '(event: PointerEvent | KeyboardEvent)' } }
    },
    default: {
      control: false,
      description: 'The parts: Header, Description, Content, Footer, ResizeHandle.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: { draggable: false, resizable: false }
}

export default meta

const CARD_BODY = `
  <ChartCard.Header>
    <ChartCard.Title>Threats vs requests</ChartCard.Title>
  </ChartCard.Header>
  <ChartCard.Description>Requests WAF analyzed, split into blocked, logged and allowed.</ChartCard.Description>
  <ChartCard.Content>
    ${CHART}
  </ChartCard.Content>
  <ChartCard.Footer>Last hour, 5 minute buckets</ChartCard.Footer>`

const Template = (args) => ({
  components,
  setup: () => ({ args, labels: LABELS, series: THREATS_VS_REQUESTS }),
  template: `<div class="max-w-(--container-3xl)"><ChartCard v-bind="args">${CARD_BODY}
</ChartCard></div>`
})

const DEFAULT_MARKUP = `<ChartCard>${CARD_BODY}
</ChartCard>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A padded card with a title, a description, the chart, and a footer naming the range. The chart inside takes its accessible name from the card title.'
      },
      source: { code: toSfc(THREATS_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const CONTENT_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
  <ChartCard>
    <ChartCard.Header>
      <ChartCard.Title>Padded</ChartCard.Title>
    </ChartCard.Header>
    <ChartCard.Content>
      ${CHART}
    </ChartCard.Content>
  </ChartCard>
  <ChartCard>
    <ChartCard.Header>
      <ChartCard.Title>Flush</ChartCard.Title>
    </ChartCard.Header>
    <ChartCard.Content flush>
      ${CHART}
    </ChartCard.Content>
  </ChartCard>
</div>`

export const Content = {
  render: () => ({
    components,
    setup: () => ({ labels: LABELS, series: THREATS_VS_REQUESTS }),
    template: CONTENT_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Padded content for a chart with axes and a legend; flush content for an edge-to-edge plot.'
      },
      source: { code: toSfc(THREATS_SCRIPT, CONTENT_TEMPLATE) }
    }
  }
}

const CONTROLS_TEMPLATE = `<ChartCard class="max-w-(--container-3xl)">
  <ChartCard.Header>
    <ChartCard.Title>Cross-site scripting threats</ChartCard.Title>
    <ChartCard.Controls>
      <Tag label="Sum" severity="secondary" icon="pi pi-calculator" />
      <Tag label="+12.40%" severity="danger" />
      <Dropdown>
        <DropdownTrigger>
          <IconButton kind="transparent" size="small" icon="pi pi-ellipsis-h" aria-label="More options" />
        </DropdownTrigger>
        <DropdownGroup>
          <DropdownOption value="copy-query" label="Copy query" />
          <DropdownOption value="export-csv" label="Export CSV" />
          <DropdownOption value="mean-line" label="Show mean line" />
        </DropdownGroup>
      </Dropdown>
    </ChartCard.Controls>
  </ChartCard.Header>
  <ChartCard.Description>Requests carrying cross-site scripting attacks against your domains.</ChartCard.Description>
  <ChartCard.Content>
    <Chart :series="series" :labels="labels">
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Line />
      <Chart.Crosshair />
      <Chart.Tooltip />
    </Chart>
  </ChartCard.Content>
</ChartCard>`

export const WithControls = {
  render: () => ({
    components,
    setup: () => ({ labels: LABELS, series: XSS_THREATS }),
    template: CONTROLS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The aggregation and variation tags sit before the options menu. The menu carries Copy query and Export CSV, the two paths a person takes to move this data into another tool.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            CHART_IMPORT,
            "import Dropdown, { DropdownGroup, DropdownOption, DropdownTrigger } from '@aziontech/webkit/dropdown'",
            "import IconButton from '@aziontech/webkit/icon-button'",
            "import Tag from '@aziontech/webkit/tag'",
            '',
            declare('labels', LABELS),
            declare('series', XSS_THREATS)
          ],
          CONTROLS_TEMPLATE
        )
      }
    }
  }
}

const RESIZABLE_TEMPLATE = `<div class="grid grid-cols-12 gap-(--spacing-md)">
  <ChartCard v-model:span="span" v-model:height="height" resizable>
    <ChartCard.Header>
      <ChartCard.Title>Threats vs requests</ChartCard.Title>
      <ChartCard.Controls>{{ span }} of 12 columns</ChartCard.Controls>
    </ChartCard.Header>
    <ChartCard.Content>
      ${CHART}
    </ChartCard.Content>
    <ChartCard.ResizeHandle />
  </ChartCard>
</div>`

export const Resizable = {
  render: () => ({
    components,
    setup: () => ({ labels: LABELS, series: THREATS_VS_REQUESTS, span: ref(6), height: ref(420) }),
    template: RESIZABLE_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Drag the corner to change the span and the height, or focus it: Left and Right change the span by one column, Up and Down the height by 24 pixels.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            CHART_IMPORT,
            "import { ref } from 'vue'",
            '',
            declare('labels', LABELS),
            declare('series', THREATS_VS_REQUESTS),
            'const span = ref(6)',
            'const height = ref(420)'
          ],
          RESIZABLE_TEMPLATE
        )
      }
    }
  }
}

const DRAGGABLE_SCRIPT = `const cards = ref([
  { id: 'threats', title: 'Threats vs requests', span: 6 },
  { id: 'xss', title: 'Cross-site scripting threats', span: 6 },
  { id: 'hosts', title: 'WAF threat requests by host', span: 12 }
])
const from = ref(-1)
const reorder = (to) => {
  if (from.value < 0 || from.value === to) return
  const [card] = cards.value.splice(from.value, 1)
  cards.value.splice(to, 0, card)
  from.value = -1
}
const move = (index, direction) => {
  const step = direction === 'up' || direction === 'left' ? -1 : 1
  const to = index + step
  if (to < 0 || to >= cards.value.length) return
  from.value = index
  reorder(to)
}`

const DRAGGABLE_TEMPLATE = `<div class="grid grid-cols-12 gap-(--spacing-md)">
  <ChartCard
    v-for="(card, index) in cards"
    :key="card.id"
    v-model:span="card.span"
    draggable
    @drag-start="from = index"
    @dragover.prevent
    @drop="reorder(index)"
    @move="(event, direction) => move(index, direction)"
  >
    <ChartCard.Header>
      <ChartCard.DragHandle />
      <ChartCard.Title>{{ card.title }}</ChartCard.Title>
    </ChartCard.Header>
    <ChartCard.Content>
      <Chart :series="seriesFor(card.id)" :labels="labels" :height="160">
        <Chart.Grid />
        <Chart.Axis kind="y" />
        <Chart.Line />
        <Chart.Tooltip />
      </Chart>
    </ChartCard.Content>
  </ChartCard>
</div>`

const SERIES_BY_CARD = { threats: THREATS_VS_REQUESTS, xss: XSS_THREATS, hosts: HOSTS }

export const Draggable = {
  render: () => ({
    components,
    setup() {
      const cards = ref([
        { id: 'threats', title: 'Threats vs requests', span: 6 },
        { id: 'xss', title: 'Cross-site scripting threats', span: 6 },
        { id: 'hosts', title: 'WAF threat requests by host', span: 12 }
      ])
      const from = ref(-1)
      const reorder = (to) => {
        if (from.value < 0 || from.value === to) return
        const [card] = cards.value.splice(from.value, 1)
        cards.value.splice(to, 0, card)
        from.value = -1
      }
      const move = (index, direction) => {
        const step = direction === 'up' || direction === 'left' ? -1 : 1
        const to = index + step
        if (to < 0 || to >= cards.value.length) return
        from.value = index
        reorder(to)
      }
      const seriesFor = (id) => SERIES_BY_CARD[id]
      return { cards, from, reorder, move, seriesFor, labels: LABELS }
    },
    template: DRAGGABLE_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Three cards on a 12-column grid. Drag a card by its handle to drop it on another, or focus the handle and use the arrow keys. The page owns the order; the card only reports the gesture.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            CHART_IMPORT,
            "import { ref } from 'vue'",
            '',
            declare('labels', LABELS),
            `const seriesFor = (id) => (${JSON.stringify(SERIES_BY_CARD)})[id]`,
            DRAGGABLE_SCRIPT
          ],
          DRAGGABLE_TEMPLATE
        )
      }
    }
  }
}
