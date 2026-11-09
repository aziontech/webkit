import Button from '@aziontech/webkit/button'
import Chart from '@aziontech/webkit/chart'
import ChartCard from '@aziontech/webkit/chart-card'
import DonutChart from '@aziontech/webkit/donut-chart'
import Dropdown from '@aziontech/webkit/dropdown'
import EmptyState from '@aziontech/webkit/empty-state'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Link from '@aziontech/webkit/link'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Skeleton from '@aziontech/webkit/skeleton'
import StatTile from '@aziontech/webkit/stat-tile'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { ref } from 'vue'

import { compound, VUE_IMPORT, webkitImport } from './_account-markup'

const POINTS = 24

const hash = (seed) => {
  let h = 0x811c9dc5
  for (const char of seed) {
    h ^= char.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return (h ^ (h >>> 16)) >>> 0 || 1
}

const random = (seed) => {
  let h = hash(seed)
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return (h % 10_000) / 10_000
  }
}

const wave = (seed, base, spread) => {
  const next = random(seed)
  const phase = next() * Math.PI * 2
  return Array.from({ length: POINTS }, (_, index) => {
    const swing = Math.sin(phase + (index / POINTS) * Math.PI * 2)
    const noise = (next() - 0.5) * spread * 0.6
    return Math.max(0, base * (1 + spread * 0.6 * swing + noise))
  })
}

const variationOf = (seed) => (random(`variation:${seed}`)() - 0.45) * 36

const round = (values, digits = 0) => values.map((value) => Number(value.toFixed(digits)))

const sum = (values) => values.reduce((total, value) => total + value, 0)

const tone = (delta) => {
  if (Math.abs(delta) < 0.01) return 'secondary'
  return delta > 0 ? 'danger' : 'success'
}

const variationTag = (id) => {
  const delta = variationOf(`${id}:24h`)
  return {
    label: `${delta > 0 ? '+' : ''}${delta.toFixed(2)}%`,
    severity: tone(delta),
    icon: delta > 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-left'
  }
}

const figure = (id, base, spread, aggregation = 'sum') => {
  const trend = round(wave(`summary:${id}:24h`, base, spread), aggregation === 'avg' ? 2 : 0)
  const total = sum(trend)
  return {
    trend,
    value: Number((aggregation === 'avg' ? total / trend.length : total).toFixed(2)),
    delta: Number(variationOf(`summary:${id}:24h`).toFixed(2))
  }
}

const BLOCKED = figure('threats-blocked', 2040, 0.4)
const INSPECTED = figure('requests-inspected', 9.4e4, 0.3)
const RATE = figure('block-rate', 2.2, 0.25, 'avg')

const THREATS = [
  {
    id: 'blocked',
    name: 'Blocked',
    color: 'danger',
    values: round(wave('threats-over-time:blocked:24h', 2040, 0.4))
  },
  {
    id: 'logged',
    name: 'Logged',
    color: 'warning',
    values: round(wave('threats-over-time:logged:24h', 560, 0.5))
  }
]

const FAMILY_LABELS = [
  'SQL injection',
  'Cross-site scripting',
  'Path traversal',
  'Remote file inclusion',
  'Unwanted access',
  'Evading tricks'
]

const FAMILIES = [
  {
    id: 'requests',
    name: 'Threats by attack family',
    values: [18_420, 12_960, 7_310, 4_180, 3_240, 1_870]
  }
]

const COUNTRIES = [
  ['Brazil', 14_820],
  ['United States', 10_640],
  ['Germany', 6_130],
  ['Netherlands', 4_270],
  ['India', 3_480],
  ['Singapore', 2_190],
  ['France', 1_460]
].map(([name, value]) => ({ id: name, name, values: [value] }))

const IP_COLUMNS = [
  ['remoteAddress', 'IP address', 'start'],
  ['asn', 'Network', 'start'],
  ['country', 'Country', 'start'],
  ['family', 'Main attack', 'start'],
  ['requests', 'Blocked requests', 'end']
].map(([id, header, align], index) => ({
  id,
  accessorKey: id,
  header,
  align,
  enableSorting: true,
  principal: index === 0
}))

const IP_ROWS = [
  ['45.155.205.233', 'AS204428 SS-Net', 'Netherlands', 'SQL injection', 4_120],
  ['185.220.101.47', 'AS208294 Tor exit', 'Germany', 'Cross-site scripting', 3_640],
  ['193.32.162.159', 'AS47890 Unmanaged', 'Romania', 'Path traversal', 2_910],
  ['91.240.118.172', 'AS49870 Alsycon', 'Netherlands', 'SQL injection', 2_480],
  ['80.82.77.139', 'AS202425 IP Volume', 'Seychelles', 'Unwanted access', 1_960],
  ['162.142.125.221', 'AS398324 Censys', 'United States', 'Evading tricks', 1_390],
  ['198.235.24.130', 'AS396982 Google Cloud', 'United States', 'Remote file inclusion', 1_120],
  ['71.6.199.23', 'AS10439 CariNet', 'United States', 'Cross-site scripting', 860]
].map(([remoteAddress, asn, country, family, requests]) => ({
  id: remoteAddress,
  remoteAddress,
  asn,
  country,
  family,
  requests
}))

const ATTENTION = [
  {
    id: 'log-only',
    icon: 'pi pi-eye',
    title: 'WAF logs threats it does not block',
    description: 'Shop runs WAF in log-only mode: 1.2K threats passed.',
    severity: 'warning',
    tag: 'Log only',
    action: { label: 'Review WAF rules', href: '/waf-rules' }
  },
  {
    id: 'spike',
    icon: 'pi pi-chart-line',
    title: 'Threat spike on api.example.com',
    description: 'SQL injection on the API rose 64% in the last hour.',
    severity: 'danger',
    tag: 'Spike',
    action: { label: 'Open threat metrics', href: '/real-time-metrics?dashboard=waf' }
  },
  {
    id: 'no-waf',
    icon: 'pi pi-shield',
    title: 'Firewall without a WAF rule set',
    description: 'The docs workload has a firewall but no WAF rule set.',
    severity: 'warning',
    tag: 'No WAF',
    action: { label: 'Open Firewall', href: '/firewall' }
  }
]

const FORMS = [
  { label: 'Line', value: 'line' },
  { label: 'Bar', value: 'bar' }
]

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const formatCount = (value) => compact.format(value)
const formatPercent = (value) => `${value.toFixed(value >= 10 ? 0 : 1)}%`

const labelsFor = () =>
  Array.from({ length: POINTS }, (_, index) => new Date(Date.UTC(2026, 10, 9, index)))

const WEBKIT = [
  ['Button', 'button'],
  ['Chart', 'chart'],
  ['ChartCard', 'chart-card'],
  ['DonutChart', 'donut-chart'],
  ['Dropdown', 'dropdown'],
  ['EmptyState', 'empty-state'],
  ['Hint', 'hint'],
  ['IconButton', 'icon-button'],
  ['InputText', 'input-text'],
  ['Item', 'item'],
  ['Link', 'link'],
  ['SegmentedButton', 'segmented-button'],
  ['Skeleton', 'skeleton'],
  ['StatTile', 'stat-tile'],
  ['TableRoot', 'table-root'],
  ['Tag', 'tag'],
  ['Tooltip', 'tooltip']
]

export const components = {
  Button,
  DonutChart,
  EmptyState,
  Hint,
  IconButton,
  InputText,
  Link,
  SegmentedButton,
  Skeleton,
  StatTile,
  TableRoot,
  Tag,
  Tooltip,
  ...compound('Chart', Chart, ['Grid', 'Axis', 'Line', 'Bar', 'Crosshair', 'Tooltip', 'Legend']),
  ...compound('ChartCard', ChartCard, ['Header', 'Title', 'Controls', 'Content']),
  ...compound('Dropdown', Dropdown, ['Trigger', 'Group', 'Option']),
  ...compound('Item', Item, ['List', 'Media', 'Content', 'Title', 'Description'])
}

const indent = (markup, depth) =>
  markup
    .split('\n')
    .map((line) => (line ? `${'  '.repeat(depth)}${line}` : line))
    .join('\n')

const quote = (value) => `'${String(value).replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  const pad = '  '.repeat(depth)
  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === 'number')) {
      const inline = `[${value.join(', ')}]`
      if (inline.length + pad.length <= 96) return inline
      const rows = []
      for (let index = 0; index < value.length; index += 12) {
        rows.push(`${pad}  ${value.slice(index, index + 12).join(', ')}`)
      }
      return `[\n${rows.join(',\n')}\n${pad}]`
    }
    return `[\n${value.map((entry) => `${pad}  ${literal(entry, depth + 1)}`).join(',\n')}\n${pad}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, entry]) => `${key}: ${literal(entry, depth + 1)}`
    )
    const inline = `{ ${entries.join(', ')} }`
    if (inline.length + pad.length <= 96 && !inline.includes('\n')) return inline
    return `{\n${entries.map((entry) => `${pad}  ${entry}`).join(',\n')}\n${pad}}`
  }
  return typeof value === 'number' ? String(value) : quote(value)
}

const declare = (name, value) => `const ${name} = ${literal(value)}`

const header = ({ title, hint, id, wide = false, form = '' }) => {
  const variation = variationTag(id)
  const formControl = form
    ? `
      <SegmentedButton
        v-model="${form}"
        :options="forms"
        size="small"
        aria-label="Chart form for ${title}"
      />`
    : ''
  return `<ChartCard.Header>
  <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
    <ChartCard.Title>${title}</ChartCard.Title>
    <Hint text="${hint}" />
  </span>
  <ChartCard.Controls>
    <span
      ${wide ? 'data-wide\n      ' : ''}class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
    >
      <Tag label="Sum" severity="secondary" size="small" icon="pi pi-calculator" />
      <Tag label="${variation.label}" severity="${variation.severity}" icon="${variation.icon}" size="small" />${formControl}
    </span>
    <Tooltip text="Expand">
      <IconButton icon="pi pi-window-maximize" kind="transparent" size="small" aria-label="Expand ${title}" />
    </Tooltip>
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger>
        <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="More options for ${title}" />
      </Dropdown.Trigger>
      <Dropdown.Group>
        <Dropdown.Option value="query" label="Copy query" />
        <Dropdown.Option value="export" label="Export CSV" />
      </Dropdown.Group>
    </Dropdown>
  </ChartCard.Controls>
</ChartCard.Header>`
}

const EMPTY_COPY = `empty-title="No data available"
  empty-description="Nothing was recorded in this period."`

const flag = (on, attribute) => (on ? `\n  ${attribute}` : '')

const statTile = ({
  label,
  hint,
  value,
  trend,
  format,
  inverse,
  loading
}) => `<li class="flex min-w-0 flex-col">
  <StatTile
    label="${label}"
    :value="${value}"
    :format-value="${format}"
    :delta="${value}Delta"
    delta-label="vs previous 24 hours"${inverse ? '\n    inverse' : ''}
    :trend="${trend}"${loading ? '\n    loading' : ''}
  >
    <template #aside>
      <Hint text="${hint}" />
    </template>
  </StatTile>
</li>`

const emptyTile = ({ label, hint, format, inverse }) => `<li class="flex min-w-0 flex-col">
  <StatTile
    label="${label}"
    :value="null"
    :format-value="${format}"
    delta-label="vs previous 24 hours"${inverse ? '\n    inverse' : ''}
  >
    <template #aside>
      <Hint text="${hint}" />
    </template>
  </StatTile>
</li>`

const TILES = [
  {
    label: 'Threats blocked',
    hint: 'Requests the WAF identified as attacks and blocked before they reached a workload.',
    value: 'threatsBlocked',
    trend: 'threatsBlockedTrend',
    format: 'formatCount',
    inverse: true
  },
  {
    label: 'Requests inspected',
    hint: 'Requests the WAF analyzed across every workload with a firewall.',
    value: 'requestsInspected',
    trend: 'requestsInspectedTrend',
    format: 'formatCount',
    inverse: false
  },
  {
    label: 'Block rate',
    hint: 'Share of inspected requests the WAF blocked as threats.',
    value: 'blockRate',
    trend: 'blockRateTrend',
    format: 'formatPercent',
    inverse: true
  }
]

const tiles = (state) => `<ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
${indent(
  TILES.map((tile) =>
    state === 'empty' ? emptyTile(tile) : statTile({ ...tile, loading: state === 'loading' })
  ).join('\n'),
  1
)}
</ul>`

const threatsCard = (loading) => `<ChartCard :span="8">
${indent(
  header({
    title: 'Threats over time',
    hint: 'Threats the WAF blocked, and threats it logged without blocking.',
    id: 'threats-over-time',
    form: 'form'
  }),
  1
)}
  <ChartCard.Content>
    <Chart
      v-model:active-index="activeIndex"
      :series="threats"
      :labels="labels"
      :format-value="formatCount"
      ${EMPTY_COPY}${flag(loading, '    loading')}
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Bar v-if="form === 'bar'" stacked />
      <Chart.Line v-else />
      <Chart.Crosshair />
      <Chart.Tooltip />
      <Chart.Legend totals />
    </Chart>
  </ChartCard.Content>
</ChartCard>`

const attentionCard = (loading) => {
  const body = loading
    ? `<div class="flex flex-col gap-(--spacing-md)">
  <div v-for="row in 3" :key="row" class="flex flex-col gap-(--spacing-xs)">
    <Skeleton width="60%" height="0.875rem" />
    <Skeleton width="90%" height="0.75rem" />
  </div>
</div>`
    : `<Item.List>
  <Item v-for="entry in attention" :key="entry.id" role="listitem" kind="inline" size="small">
    <Item.Media>
      <i :class="entry.icon" class="text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />
    </Item.Media>
    <Item.Content>
      <Item.Title>{{ entry.title }}</Item.Title>
      <Item.Description>{{ entry.description }}</Item.Description>
      <span class="flex flex-wrap items-center gap-(--spacing-xs)">
        <Tag :label="entry.tag" :severity="entry.severity" size="small" />
        <Link :label="entry.action.label" :href="entry.action.href" size="small" :show-icon="false" />
      </span>
    </Item.Content>
  </Item>
</Item.List>`
  return `<ChartCard :span="4">
  <ChartCard.Header>
    <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
      <ChartCard.Title>Needs attention</ChartCard.Title>
      <Hint text="Settings and traffic on your workloads that ask for a decision." />
    </span>${
      loading
        ? ''
        : `
    <ChartCard.Controls>
      <Tag :label="\`\${attention.length} open\`" severity="secondary" size="small" />
    </ChartCard.Controls>`
    }
  </ChartCard.Header>
  <ChartCard.Content>
${indent(body, 2)}
  </ChartCard.Content>
</ChartCard>`
}

const familyCard = (loading) => `<ChartCard :span="6">
${indent(
  header({
    title: 'Threats by attack family',
    hint: 'Blocked requests, broken down by the attack family the WAF matched.',
    id: 'threats-by-family'
  }),
  1
)}
  <ChartCard.Content>
    <Chart
      :series="families"
      :labels="familyLabels"
      orientation="horizontal"
      :format-value="formatCount"
      ${EMPTY_COPY}${flag(loading, '    loading')}
    >
      <Chart.Grid />
      <Chart.Axis kind="y" />
      <Chart.Axis kind="x" />
      <Chart.Bar labeled />
      <Chart.Tooltip />
    </Chart>
  </ChartCard.Content>
</ChartCard>`

const countryCard = (loading) => `<ChartCard :span="6">
${indent(
  header({
    title: 'Threats by country',
    hint: 'Blocked requests, broken down by the country they came from.',
    id: 'threats-by-country'
  }),
  1
)}
  <ChartCard.Content>
    <DonutChart
      :series="countries"
      kind="pie"
      :format-value="formatCount"
      ${EMPTY_COPY}${flag(loading, '    loading')}
      aria-label="Threats by country"
    />
  </ChartCard.Content>
</ChartCard>`

const ipCard = (loading) => `<ChartCard :span="12">
${indent(
  header({
    title: 'Top source IPs by blocked requests',
    hint: 'The addresses the WAF blocked most often, with their network and main attack.',
    id: 'top-source-ips',
    wide: true
  }),
  1
)}
  <ChartCard.Content>
    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <div class="min-w-36 grow basis-(--container-3xs)">
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search addresses, networks or attacks"
            aria-label="Search addresses, networks or attacks"
          >
            <template #iconLeft>
              <i class="pi pi-search" aria-hidden="true" />
            </template>
          </InputText>
        </div>
      </div>
      <TableRoot
        v-model:global-filter="search"
        :data="ipRows"
        :columns="ipColumns"
        row-key="id"
        enable-sorting
        paginated
        :page-size="5"
        :rows-per-page-options="[5, 10, 25]"
        header-kind="compact"
        border${flag(loading, '      loading')}
      >
        <template #empty>
          <EmptyState
            size="small"
            icon="pi pi-search"
            title="No matching rows"
            description="Change the search."
          />
        </template>
        <template #cell-requests="{ row }">
          <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
        </template>
      </TableRoot>
    </div>
  </ChartCard.Content>
</ChartCard>`

const SETUP = `<EmptyState
  title="No firewall protects your workloads"
  description="Threat metrics and the Needs attention list appear once a firewall with a WAF rule set protects a workload."
  icon="pi pi-shield"
  bordered
>
  <template #actions>
    <Button label="Add firewall" kind="primary" size="medium" icon="pi pi-plus" href="/firewall" />
  </template>
</EmptyState>`

export const threatTemplate = (state) => {
  const loading = state === 'loading'
  const grid =
    state === 'empty'
      ? SETUP
      : `<div
  class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
>
${indent(
  [
    threatsCard(loading),
    attentionCard(loading),
    familyCard(loading),
    countryCard(loading),
    ipCard(loading)
  ].join('\n'),
  1
)}
</div>`
  return `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(tiles(state), 1)}
${indent(grid, 1)}
</div>`
}

const usedBindings = (template) =>
  WEBKIT.filter(([binding]) => new RegExp(`<${binding}[\\s.>/]`).test(template))

export const threatScript = (state) => {
  const template = threatTemplate(state)
  const imports = usedBindings(template).map(([binding, subpath]) => webkitImport(binding, subpath))
  const formats = [
    "const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })",
    'const formatCount = (value) => compact.format(value)',
    'const formatPercent = (value) => `${value.toFixed(value >= 10 ? 0 : 1)}%`'
  ]
  if (state === 'empty') return [...imports, '', ...formats]
  const figures =
    state === 'loading'
      ? ['const threatsBlocked = null', 'const requestsInspected = null', 'const blockRate = null']
      : [
          `const threatsBlocked = ${BLOCKED.value}`,
          `const threatsBlockedDelta = ${BLOCKED.delta}`,
          declare('threatsBlockedTrend', BLOCKED.trend),
          `const requestsInspected = ${INSPECTED.value}`,
          `const requestsInspectedDelta = ${INSPECTED.delta}`,
          declare('requestsInspectedTrend', INSPECTED.trend),
          `const blockRate = ${RATE.value}`,
          `const blockRateDelta = ${RATE.delta}`,
          declare('blockRateTrend', RATE.trend)
        ]
  const loadingFigures =
    state === 'loading'
      ? [
          'const threatsBlockedDelta = null',
          'const threatsBlockedTrend = []',
          'const requestsInspectedDelta = null',
          'const requestsInspectedTrend = []',
          'const blockRateDelta = null',
          'const blockRateTrend = []'
        ]
      : []
  return [
    ...imports,
    VUE_IMPORT(['ref']),
    '',
    ...formats,
    '',
    ...figures,
    ...loadingFigures,
    '',
    'const labels = Array.from({ length: 24 }, (_, index) => new Date(Date.UTC(2026, 10, 9, index)))',
    declare('threats', THREATS),
    declare('familyLabels', FAMILY_LABELS),
    declare('families', FAMILIES),
    declare('countries', COUNTRIES),
    declare('ipColumns', IP_COLUMNS),
    declare('ipRows', IP_ROWS),
    declare('attention', ATTENTION),
    declare('forms', FORMS),
    '',
    "const form = ref('line')",
    'const activeIndex = ref(null)',
    "const search = ref('')"
  ]
}

export const threatState = (state) => {
  const loading = state === 'loading'
  return {
    formatCount,
    formatPercent,
    threatsBlocked: loading ? null : BLOCKED.value,
    threatsBlockedDelta: loading ? null : BLOCKED.delta,
    threatsBlockedTrend: loading ? [] : BLOCKED.trend,
    requestsInspected: loading ? null : INSPECTED.value,
    requestsInspectedDelta: loading ? null : INSPECTED.delta,
    requestsInspectedTrend: loading ? [] : INSPECTED.trend,
    blockRate: loading ? null : RATE.value,
    blockRateDelta: loading ? null : RATE.delta,
    blockRateTrend: loading ? [] : RATE.trend,
    labels: labelsFor(),
    threats: THREATS,
    familyLabels: FAMILY_LABELS,
    families: FAMILIES,
    countries: COUNTRIES,
    ipColumns: IP_COLUMNS,
    ipRows: IP_ROWS,
    attention: ATTENTION,
    forms: FORMS,
    form: ref('line'),
    activeIndex: ref(null),
    search: ref('')
  }
}
