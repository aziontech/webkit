import BarList from '@aziontech/webkit/bar-list'
import Button from '@aziontech/webkit/button'
import Chart from '@aziontech/webkit/chart'
import ChartCard from '@aziontech/webkit/chart-card'
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

const MATCHED = [
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

const CATEGORIES = [
  ['SQL injection', 18_420],
  ['Cross-site scripting', 12_960],
  ['Path traversal', 7_310],
  ['Remote file inclusion', 4_180],
  ['Command injection', 3_240],
  ['Scanner probes', 1_870]
].map(([name, value]) => ({ id: name, name, value }))

const COUNTRIES = [
  ['Brazil', 14_820],
  ['United States', 10_640],
  ['Germany', 6_130],
  ['Netherlands', 4_270],
  ['India', 3_480],
  ['Singapore', 2_190],
  ['France', 1_460]
].map(([name, value]) => ({ id: name, name, value }))

const IP_COLUMNS = [
  ['remoteAddress', 'IP address', 'start'],
  ['asn', 'Network', 'start'],
  ['country', 'Country', 'start'],
  ['category', 'Main attack', 'start'],
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
  ['203.0.113.42', 'AS64496 Hosting provider', 'Netherlands', 'SQL injection', 4_120],
  ['198.51.100.17', 'AS64497 Anonymizing proxy', 'Germany', 'Cross-site scripting', 3_640],
  ['192.0.2.159', 'AS64498 Unmanaged network', 'Romania', 'Path traversal', 2_910],
  ['203.0.113.172', 'AS64496 Hosting provider', 'Netherlands', 'SQL injection', 2_480],
  ['198.51.100.139', 'AS64499 VPN service', 'Seychelles', 'Command injection', 1_960],
  ['192.0.2.221', 'AS64500 Research scanner', 'United States', 'Scanner probes', 1_390],
  ['198.51.100.130', 'AS64501 Cloud provider', 'United States', 'Remote file inclusion', 1_120],
  ['192.0.2.23', 'AS64502 Residential ISP', 'United States', 'Cross-site scripting', 860]
].map(([remoteAddress, asn, country, category, requests]) => ({
  id: remoteAddress,
  remoteAddress,
  asn,
  country,
  category,
  requests
}))

const ATTENTION = [
  {
    id: 'log-only',
    icon: 'pi pi-eye',
    title: 'A rule set logs requests it does not block',
    description: 'The shop service runs its rule set in log-only mode: 1.2K requests passed.',
    severity: 'warning',
    tag: 'Log only',
    action: { label: 'Review rules', href: '/security/rules' }
  },
  {
    id: 'spike',
    icon: 'pi pi-chart-line',
    title: 'Attack spike on api.example.com',
    description: 'SQL injection against the API rose 64% in the last hour.',
    severity: 'danger',
    tag: 'Spike',
    action: { label: 'Open security metrics', href: '/metrics/security' }
  },
  {
    id: 'no-rules',
    icon: 'pi pi-shield',
    title: 'Service without a rule set',
    description: 'The docs service has no security rule set attached.',
    severity: 'warning',
    tag: 'No rules',
    action: { label: 'Attach a rule set', href: '/security/rules' }
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
  ['BarList', 'bar-list'],
  ['Button', 'button'],
  ['Chart', 'chart'],
  ['ChartCard', 'chart-card'],
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
  BarList,
  Button,
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
    label: 'Requests blocked',
    hint: 'Requests a security rule identified as attacks and blocked before they reached a service.',
    value: 'requestsBlocked',
    trend: 'requestsBlockedTrend',
    format: 'formatCount',
    inverse: true
  },
  {
    label: 'Requests inspected',
    hint: 'Requests checked against security rules across every service.',
    value: 'requestsInspected',
    trend: 'requestsInspectedTrend',
    format: 'formatCount',
    inverse: false
  },
  {
    label: 'Block rate',
    hint: 'Share of inspected requests blocked as attacks.',
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

const matchedCard = (loading) => `<ChartCard :span="8">
${indent(
  header({
    title: 'Matched requests over time',
    hint: 'Requests that matched a rule: blocked, or logged and allowed through.',
    id: 'threats-over-time',
    form: 'form'
  }),
  1
)}
  <ChartCard.Content>
    <Chart
      v-model:active-index="activeIndex"
      :series="matchedRequests"
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
      <Hint text="Settings and traffic on your services that ask for a decision." />
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

const categoryCard = (loading) => `<ChartCard :span="6">
${indent(
  header({
    title: 'Blocked requests by attack category',
    hint: 'Blocked requests, broken down by the attack category of the rule they matched.',
    id: 'threats-by-family'
  }),
  1
)}
  <ChartCard.Content>
    <BarList
      :items="categories"
      :format-value="formatCount"
      empty-title="No data available"${flag(loading, '    loading')}
      aria-label="Blocked requests by attack category"
    />
  </ChartCard.Content>
</ChartCard>`

const countryCard = (loading) => `<ChartCard :span="6">
${indent(
  header({
    title: 'Blocked requests by country',
    hint: 'Blocked requests, broken down by the country they came from.',
    id: 'threats-by-country'
  }),
  1
)}
  <ChartCard.Content>
    <BarList
      :items="countries"
      :format-value="formatCount"
      empty-title="No data available"${flag(loading, '    loading')}
      aria-label="Blocked requests by country"
    />
  </ChartCard.Content>
</ChartCard>`

const ipCard = (loading) => `<ChartCard :span="12">
${indent(
  header({
    title: 'Top source IPs by blocked requests',
    hint: 'The addresses blocked most often, with their network and main attack.',
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
  title="No security rules protect your services"
  description="Security metrics and the Needs attention list appear once a rule set protects a service."
  icon="pi pi-shield"
  bordered
>
  <template #actions>
    <Button label="Add rule set" kind="primary" size="medium" icon="pi pi-plus" href="/security/rules" />
  </template>
</EmptyState>`

export const securityTemplate = (state) => {
  const loading = state === 'loading'
  const grid =
    state === 'empty'
      ? SETUP
      : `<div
  class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
>
${indent(
  [
    matchedCard(loading),
    attentionCard(loading),
    categoryCard(loading),
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

export const securityScript = (state) => {
  const template = securityTemplate(state)
  const imports = usedBindings(template).map(([binding, subpath]) => webkitImport(binding, subpath))
  const formats = [
    "const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })",
    'const formatCount = (value) => compact.format(value)',
    'const formatPercent = (value) => `${value.toFixed(value >= 10 ? 0 : 1)}%`'
  ]
  if (state === 'empty') return [...imports, '', ...formats]
  const figures =
    state === 'loading'
      ? ['const requestsBlocked = null', 'const requestsInspected = null', 'const blockRate = null']
      : [
          `const requestsBlocked = ${BLOCKED.value}`,
          `const requestsBlockedDelta = ${BLOCKED.delta}`,
          declare('requestsBlockedTrend', BLOCKED.trend),
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
          'const requestsBlockedDelta = null',
          'const requestsBlockedTrend = []',
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
    declare('matchedRequests', MATCHED),
    declare('categories', CATEGORIES),
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

export const securityState = (state) => {
  const loading = state === 'loading'
  return {
    formatCount,
    formatPercent,
    requestsBlocked: loading ? null : BLOCKED.value,
    requestsBlockedDelta: loading ? null : BLOCKED.delta,
    requestsBlockedTrend: loading ? [] : BLOCKED.trend,
    requestsInspected: loading ? null : INSPECTED.value,
    requestsInspectedDelta: loading ? null : INSPECTED.delta,
    requestsInspectedTrend: loading ? [] : INSPECTED.trend,
    blockRate: loading ? null : RATE.value,
    blockRateDelta: loading ? null : RATE.delta,
    blockRateTrend: loading ? [] : RATE.trend,
    labels: labelsFor(),
    matchedRequests: MATCHED,
    categories: CATEGORIES,
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
