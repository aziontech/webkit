import BarList from '@aziontech/webkit/bar-list'
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
import ChartCard, {
  ChartCardContent,
  ChartCardControls,
  ChartCardDragHandle,
  ChartCardHeader,
  ChartCardResizeHandle,
  ChartCardTitle
} from '@aziontech/webkit/chart-card'
import DonutChart from '@aziontech/webkit/donut-chart'
import Hint from '@aziontech/webkit/hint'
import Tag from '@aziontech/webkit/tag'
import { computed, nextTick, ref } from 'vue'

export const CONFIGURABLE_COMPONENTS = {
  BarList,
  Button,
  Chart,
  'Chart.Grid': ChartGrid,
  'Chart.Axis': ChartAxis,
  'Chart.Line': ChartLine,
  'Chart.Area': ChartArea,
  'Chart.Bar': ChartBar,
  'Chart.Crosshair': ChartCrosshair,
  'Chart.Tooltip': ChartTooltip,
  'Chart.Legend': ChartLegend,
  ChartCard,
  'ChartCard.Header': ChartCardHeader,
  'ChartCard.DragHandle': ChartCardDragHandle,
  'ChartCard.Title': ChartCardTitle,
  'ChartCard.Controls': ChartCardControls,
  'ChartCard.Content': ChartCardContent,
  'ChartCard.ResizeHandle': ChartCardResizeHandle,
  DonutChart,
  Hint,
  Tag
}

const IMPORTS = [
  "import BarList from '@aziontech/webkit/bar-list'",
  "import Button from '@aziontech/webkit/button'",
  "import Chart from '@aziontech/webkit/chart'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import DonutChart from '@aziontech/webkit/donut-chart'",
  "import Hint from '@aziontech/webkit/hint'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { computed, nextTick, ref } from 'vue'"
]

const wave = (seed, base, spread) => {
  let state = seed
  return Array.from({ length: 12 }, (_, index) => {
    state = (state * 9301 + 49297) % 233280
    const noise = state / 233280 - 0.5
    const swing = Math.sin(seed + (index / 12) * Math.PI * 2)
    return Math.round(Math.max(0, base * (1 + spread * 0.6 * swing + spread * 0.6 * noise)))
  })
}

const LABELS = [
  '11:00',
  '13:00',
  '15:00',
  '17:00',
  '19:00',
  '21:00',
  '23:00',
  '01:00',
  '03:00',
  '05:00',
  '07:00',
  '09:00'
]

const CARDS = {
  requests: {
    title: 'Requests over time',
    hint: 'Requests served by every service, per interval.',
    kind: 'area',
    format: 'count',
    series: [{ id: 'requests', name: 'Requests', values: wave(3, 2_040_000, 0.3) }]
  },
  regions: {
    title: 'Requests by region',
    hint: 'Share of requests by the region that served them.',
    kind: 'donut',
    format: 'count',
    series: [
      ['South America', 9_820_000],
      ['North America', 7_410_000],
      ['Europe', 4_960_000],
      ['Asia', 2_230_000],
      ['Oceania', 610_000]
    ].map(([name, value]) => ({ id: name, name, values: [value] }))
  },
  transfer: {
    title: 'Data transferred',
    hint: 'Data delivered to clients and received from them, per interval.',
    kind: 'line',
    format: 'bytes',
    series: [
      { id: 'out', name: 'Out', values: wave(5, 9_200_000_000, 0.3) },
      { id: 'in', name: 'In', values: wave(8, 1_600_000_000, 0.4) }
    ]
  },
  errors: {
    title: 'Errors by status',
    hint: 'Requests that ended in a client or server error, per interval.',
    kind: 'bar',
    format: 'count',
    series: [
      { id: '4xx', name: '4xx', values: wave(11, 18_400, 0.5) },
      { id: '5xx', name: '5xx', values: wave(13, 6_600, 0.6) }
    ]
  },
  sources: {
    title: 'Top sources',
    hint: 'The services that received the most requests in the period.',
    kind: 'bar-list',
    format: 'count',
    items: [
      ['web-app-prod', 11_420_000],
      ['payments-api', 6_240_000],
      ['storefront-checkout', 4_910_000],
      ['marketing-site', 2_380_000],
      ['status-page', 860_000]
    ].map(([name, value]) => ({ id: name, name, value }))
  },
  latency: {
    title: 'Response time',
    hint: 'Time to the first byte at the 95th percentile, per interval.',
    kind: 'line',
    format: 'ms',
    series: [{ id: 'p95', name: 'p95', values: wave(17, 182, 0.25) }]
  }
}

const LAYOUT = [
  { id: 'requests', span: 8 },
  { id: 'regions', span: 4 },
  { id: 'transfer', span: 6 },
  { id: 'errors', span: 6 },
  { id: 'sources', span: 4 },
  { id: 'latency', span: 8 }
]

const formatCount = (value) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value)

const formatBytes = (value) => {
  const steps = ['B', 'KB', 'MB', 'GB', 'TB']
  let current = value
  let index = 0
  while (current >= 1000 && index < steps.length - 1) {
    current /= 1000
    index += 1
  }
  return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
}

const formatMs = (value) => `${Math.round(value)} ms`

const FORMATTERS_SOURCE = `const formatters = {
  count: (value) =>
    new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value),
  bytes: (value) => {
    const steps = ['B', 'KB', 'MB', 'GB', 'TB']
    let current = value
    let index = 0
    while (current >= 1000 && index < steps.length - 1) {
      current /= 1000
      index += 1
    }
    return \`\${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} \${steps[index]}\`
  },
  ms: (value) => \`\${Math.round(value)} ms\`
}`

const LAYOUT_SOURCE = `const editing = ref(EDITING)
const layout = ref(defaultLayout.map((card) => ({ ...card })))
const activeIndex = ref(null)
const from = ref(-1)
const announcement = ref('')
const grid = ref(null)

const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(defaultLayout))

const sizeLabel = (card) =>
  card.height === undefined
    ? \`\${card.span} of 12 columns\`
    : \`\${card.span} of 12 columns, \${card.height} px\`

const reorder = (to) => {
  const index = from.value
  from.value = -1
  if (index < 0 || index === to) return
  const next = [...layout.value]
  const [card] = next.splice(index, 1)
  next.splice(to, 0, card)
  layout.value = next
  announcement.value = \`\${cards[card.id].title} moved to position \${to + 1} of \${next.length}.\`
}

const move = async (index, direction) => {
  const to = index + (direction === 'up' || direction === 'left' ? -1 : 1)
  if (to < 0 || to >= layout.value.length) return
  const { id } = layout.value[index]
  from.value = index
  reorder(to)
  await nextTick()
  grid.value?.querySelector(\`[data-card-id="\${id}"] [data-testid$="__drag-handle"]\`)?.focus()
}

const announceSize = (card) => {
  announcement.value = \`\${cards[card.id].title} resized to \${sizeLabel(card)}.\`
}

const reset = () => {
  layout.value = defaultLayout.map((card) => ({ ...card }))
  announcement.value = 'Layout reset to the default.'
}`

const STATES = {
  default: { loading: false, empty: false, editing: false },
  editing: { loading: false, empty: false, editing: true },
  loading: { loading: true, empty: false, editing: false },
  empty: { loading: false, empty: true, editing: false }
}

const cardsFor = (empty) =>
  Object.fromEntries(
    Object.entries(CARDS).map(([id, card]) => [
      id,
      empty ? { ...card, series: card.series && [], items: card.items && [] } : card
    ])
  )

export const configurableSetup = (state) => () => {
  const { loading, empty, editing: startEditing } = STATES[state]
  const cards = cardsFor(empty)
  const editing = ref(startEditing)
  const layout = ref(LAYOUT.map((card) => ({ ...card })))
  const activeIndex = ref(null)
  const from = ref(-1)
  const announcement = ref('')
  const grid = ref(null)

  const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(LAYOUT))

  const sizeLabel = (card) =>
    card.height === undefined
      ? `${card.span} of 12 columns`
      : `${card.span} of 12 columns, ${card.height} px`

  const reorder = (to) => {
    const index = from.value
    from.value = -1
    if (index < 0 || index === to) return
    const next = [...layout.value]
    const [card] = next.splice(index, 1)
    next.splice(to, 0, card)
    layout.value = next
    announcement.value = `${cards[card.id].title} moved to position ${to + 1} of ${next.length}.`
  }

  const move = async (index, direction) => {
    const to = index + (direction === 'up' || direction === 'left' ? -1 : 1)
    if (to < 0 || to >= layout.value.length) return
    const { id } = layout.value[index]
    from.value = index
    reorder(to)
    await nextTick()
    grid.value?.querySelector(`[data-card-id="${id}"] [data-testid$="__drag-handle"]`)?.focus()
  }

  const announceSize = (card) => {
    announcement.value = `${cards[card.id].title} resized to ${sizeLabel(card)}.`
  }

  const reset = () => {
    layout.value = LAYOUT.map((card) => ({ ...card }))
    announcement.value = 'Layout reset to the default.'
  }

  return {
    loading,
    cards,
    labels: LABELS,
    formatters: { count: formatCount, bytes: formatBytes, ms: formatMs },
    editing,
    layout,
    activeIndex,
    from,
    announcement,
    grid,
    customized,
    reorder,
    move,
    announceSize,
    reset
  }
}

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const configurableScript = (state) => {
  const { loading, empty, editing } = STATES[state]
  return [
    ...IMPORTS,
    '',
    `const loading = ${loading}`,
    '',
    literal('labels', LABELS),
    '',
    literal('cards', cardsFor(empty)),
    '',
    literal('defaultLayout', LAYOUT),
    '',
    FORMATTERS_SOURCE,
    '',
    LAYOUT_SOURCE.replace('EDITING', String(editing))
  ]
}

export const CONFIGURABLE_TEMPLATE = `<div class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
    <p v-if="editing" class="m-0 min-w-0 grow text-body-sm text-(--text-muted)">
      Drag a card by its handle to move it, or by its corner to resize it. Focus a handle to use the arrow keys.
    </p>
    <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
      <Button
        v-if="customized"
        label="Reset layout"
        kind="text"
        size="medium"
        icon="pi pi-replay"
        @click="reset"
      />
      <Button
        :label="editing ? 'Done' : 'Edit layout'"
        :kind="editing ? 'primary' : 'outlined'"
        size="medium"
        :icon="editing ? 'pi pi-check' : 'pi pi-th-large'"
        :aria-pressed="editing"
        @click="editing = !editing"
      />
    </div>
  </div>

  <div
    ref="grid"
    class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
  >
    <ChartCard
      v-for="(card, index) in layout"
      :key="card.id"
      v-model:span="card.span"
      v-model:height="card.height"
      :data-card-id="card.id"
      :draggable="editing"
      :resizable="editing"
      :min-span="3"
      :max-span="12"
      :min-height="280"
      :max-height="720"
      @drag-start="from = index"
      @dragover.prevent
      @drop="reorder(index)"
      @move="(event, direction) => move(index, direction)"
      @resize-end="announceSize(card)"
    >
      <ChartCard.Header>
        <ChartCard.DragHandle :aria-label="'Move ' + cards[card.id].title" />
        <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
          <ChartCard.Title>{{ cards[card.id].title }}</ChartCard.Title>
          <Hint :text="cards[card.id].hint" />
        </span>
        <ChartCard.Controls v-if="editing">
          <Tag :label="card.span + '/12'" severity="secondary" size="small" icon="pi pi-arrows-h" />
        </ChartCard.Controls>
      </ChartCard.Header>
      <ChartCard.Content>
        <DonutChart
          v-if="cards[card.id].kind === 'donut'"
          :series="cards[card.id].series"
          :format-value="formatters[cards[card.id].format]"
          empty-title="No requests yet"
          empty-description="Metrics appear here once a service serves requests."
          :loading="loading"
          :aria-label="cards[card.id].title"
        />
        <BarList
          v-else-if="cards[card.id].kind === 'bar-list'"
          :items="cards[card.id].items"
          sort="descending"
          :format-value="formatters[cards[card.id].format]"
          empty-title="No requests yet"
          :loading="loading"
          :aria-label="cards[card.id].title"
        />
        <Chart
          v-else
          v-model:active-index="activeIndex"
          :series="cards[card.id].series"
          :labels="labels"
          :format-value="formatters[cards[card.id].format]"
          empty-title="No requests yet"
          empty-description="Metrics appear here once a service serves requests."
          :loading="loading"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Bar v-if="cards[card.id].kind === 'bar'" stacked />
          <Chart.Area v-else-if="cards[card.id].kind === 'area'" />
          <Chart.Line v-else />
          <Chart.Crosshair />
          <Chart.Tooltip />
          <Chart.Legend v-if="cards[card.id].series.length > 1" totals />
        </Chart>
      </ChartCard.Content>
      <ChartCard.ResizeHandle :aria-label="'Resize ' + cards[card.id].title" />
    </ChartCard>
  </div>

  <p class="sr-only" aria-live="polite">{{ announcement }}</p>
</div>`
