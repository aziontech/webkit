<script setup lang="ts">
  import Chart, { type ChartColor, type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, onBeforeUnmount, ref } from 'vue'

  type MetricFormat = 'count' | 'bytes' | 'percentage' | 'ms' | 'seconds'
  type HighlightForm = 'area' | 'line' | 'stacked'

  interface Period {
    value: string
    label: string
    begin: string
    end: string
    comparison: string
    scale: number
    labels: string[]
  }

  interface SummaryTile {
    id: string
    label: string
    format: MetricFormat
    base: number
    rate?: boolean
    inverse?: boolean
  }

  interface HighlightSeries {
    id: string
    name: string
    base: number
    color?: ChartColor
  }

  interface Highlight {
    id: string
    title: string
    hint: string
    product: string
    href: string
    dataset: string
    format: MetricFormat
    form: HighlightForm
    series: HighlightSeries[]
  }

  const periods: Period[] = [
    {
      value: '1h',
      begin: '2026-11-14T13:30:00Z',
      end: '2026-11-14T14:30:00Z',
      label: 'Last hour',
      comparison: 'vs previous hour',
      scale: 1 / 24,
      labels: [
        '13:35',
        '13:40',
        '13:45',
        '13:50',
        '13:55',
        '14:00',
        '14:05',
        '14:10',
        '14:15',
        '14:20',
        '14:25',
        '14:30'
      ]
    },
    {
      value: '24h',
      begin: '2026-11-13T14:00:00Z',
      end: '2026-11-14T14:00:00Z',
      label: 'Last 24 hours',
      comparison: 'vs previous 24 hours',
      scale: 1,
      labels: [
        '16:00',
        '18:00',
        '20:00',
        '22:00',
        '00:00',
        '02:00',
        '04:00',
        '06:00',
        '08:00',
        '10:00',
        '12:00',
        '14:00'
      ]
    },
    {
      value: '7d',
      begin: '2026-11-04T00:00:00Z',
      end: '2026-11-10T23:59:59Z',
      label: 'Last 7 days',
      comparison: 'vs previous 7 days',
      scale: 7,
      labels: ['Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9', 'Nov 10']
    },
    {
      value: '30d',
      begin: '2026-10-12T00:00:00Z',
      end: '2026-11-10T23:59:59Z',
      label: 'Last 30 days',
      comparison: 'vs previous 30 days',
      scale: 30,
      labels: [
        'Oct 12',
        'Oct 15',
        'Oct 18',
        'Oct 21',
        'Oct 24',
        'Oct 27',
        'Oct 30',
        'Nov 2',
        'Nov 5',
        'Nov 8'
      ]
    }
  ]

  const summary: SummaryTile[] = [
    { id: 'requests', label: 'Requests', format: 'count', base: 2040000 },
    { id: 'data', label: 'Data transferred', format: 'bytes', base: 9200000000 },
    { id: 'offload', label: 'Cache offload', format: 'percentage', base: 82, rate: true },
    { id: '5xx', label: 'Status 5xx', format: 'count', base: 6600, inverse: true },
    { id: 'denied', label: 'Requests denied', format: 'count', base: 49000, inverse: true },
    { id: 'invocations', label: 'Function invocations', format: 'count', base: 610000 }
  ]

  const highlights: Highlight[] = [
    {
      id: 'requests',
      title: 'Requests',
      hint: 'Requests your applications served, per interval.',
      product: 'Applications',
      href: '/metrics/applications?view=overview',
      dataset: 'httpMetrics',
      format: 'count',
      form: 'area',
      series: [{ id: 'requests', name: 'Requests', base: 2040000 }]
    },
    {
      id: 'cache',
      title: 'Cache hits and misses',
      hint: 'Requests answered from the cache and requests sent to the origin, per interval.',
      product: 'Applications',
      href: '/metrics/applications?view=overview',
      dataset: 'httpMetrics',
      format: 'count',
      form: 'stacked',
      series: [
        { id: 'hits', name: 'Hits', base: 1750000 },
        { id: 'misses', name: 'Misses', base: 250000 }
      ]
    },
    {
      id: 'decisions',
      title: 'Allowed and denied',
      hint: 'Requests the firewall let through and requests it denied, per interval.',
      product: 'Firewall',
      href: '/metrics/firewall?view=overview',
      dataset: 'firewallMetrics',
      format: 'count',
      form: 'stacked',
      series: [
        { id: 'allowed', name: 'Allowed', base: 1850000 },
        { id: 'denied', name: 'Denied', base: 49000, color: 'danger' }
      ]
    },
    {
      id: 'status',
      title: 'Status codes',
      hint: 'Requests per status class, per interval.',
      product: 'Applications',
      href: '/metrics/applications?view=status-codes',
      dataset: 'httpMetrics',
      format: 'count',
      form: 'line',
      series: [
        { id: '2xx', name: 'Status 2xx', base: 1700000 },
        { id: '3xx', name: 'Status 3xx', base: 240000 },
        { id: '4xx', name: 'Status 4xx', base: 60000 },
        { id: '5xx', name: 'Status 5xx', base: 6600 }
      ]
    },
    {
      id: '5xx',
      title: 'Status 5xx',
      hint: 'Requests that ended in a server error, per interval. A rise is a regression.',
      product: 'Applications',
      href: '/metrics/applications?view=status-codes',
      dataset: 'httpMetrics',
      format: 'count',
      form: 'area',
      series: [{ id: '5xx', name: 'Status 5xx', base: 6600, color: 'danger' }]
    },
    {
      id: 'invocations',
      title: 'Function invocations',
      hint: 'Times your functions ran, per interval.',
      product: 'Functions',
      href: '/metrics/functions?view=overview',
      dataset: 'functionMetrics',
      format: 'count',
      form: 'area',
      series: [{ id: 'invocations', name: 'Invocations', base: 610000 }]
    }
  ]

  type HighlightCard = Omit<Highlight, 'series'> & { series: ChartSeries[] }

  const chartForms: ToggleGroupOption[] = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const decimal = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

  const formatters: Record<MetricFormat, (value: number) => string> = {
    count: (value) => compact.format(value),
    bytes: (value) => {
      const steps = ['B', 'KB', 'MB', 'GB', 'TB']
      let current = value
      let index = 0
      while (current >= 1000 && index < steps.length - 1) {
        current /= 1000
        index += 1
      }
      return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
    },
    percentage: (value) => `${value.toFixed(1)}%`,
    ms: (value) => `${decimal.format(value)} ms`,
    seconds: (value) => `${compact.format(value)} s`
  }

  const seeded = (seed: string, length: number) => {
    let h = 0x811c9dc5
    for (const char of seed) {
      h ^= char.charCodeAt(0)
      h = Math.imul(h, 0x01000193) >>> 0
    }
    return Array.from({ length }, () => {
      h ^= h << 13
      h ^= h >>> 17
      h ^= h << 5
      h >>>= 0
      return (h % 1000) / 1000
    })
  }

  const seriesValues = (seed: string, base: number, period: Period, rate?: boolean) => {
    const perPoint = rate ? base : (base * period.scale * 12) / period.labels.length
    return seeded(seed, period.labels.length).map((u) => {
      const value = perPoint * (0.78 + u * 0.44)
      return rate ? Math.round(value * 10) / 10 : Math.round(value)
    })
  }

  const period = ref('24h')
  const activeIndex = ref<number | null>(null)
  const refetching = ref(false)
  const forms = ref<Record<string, string>>(
    Object.fromEntries(
      highlights.map((highlight) => [highlight.id, highlight.form === 'stacked' ? 'bar' : 'line'])
    )
  )
  const expanded = ref(false)
  const expandedId = ref(highlights[0]?.id ?? '')
  let refreshTimer: ReturnType<typeof setTimeout> | undefined

  const periodOptions = periods.map(({ value, label }) => ({ value, label }))
  const periodLabel = (value: string) => periods.find((entry) => entry.value === value)?.label ?? ''

  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? periods[1]
  )

  const tiles = computed(() =>
    summary.map((tile) => {
      const seed = `overview:${tile.id}:${currentPeriod.value.value}`
      const trend = seriesValues(seed, tile.base, currentPeriod.value, tile.rate)
      const total = trend.reduce((sum, point) => sum + point, 0)
      const [swing] = seeded(`${seed}:delta`, 1)
      return {
        ...tile,
        trend,
        value: tile.rate ? total / trend.length : total,
        delta: Math.round(((swing ?? 0.5) * 30 - 15) * 100) / 100
      }
    })
  )

  const cards = computed<HighlightCard[]>(() =>
    highlights.map((highlight) => ({
      ...highlight,
      series: highlight.series.map((entry): ChartSeries => ({
        id: entry.id,
        name: entry.name,
        ...(entry.color ? { color: entry.color } : {}),
        values: seriesValues(
          `overview:${highlight.id}:${entry.id}:${currentPeriod.value.value}`,
          entry.base,
          currentPeriod.value
        )
      }))
    }))
  )

  const expandedCard = computed(
    () => cards.value.find((card) => card.id === expandedId.value) ?? cards.value[0]
  )

  const openExpanded = (id: string) => {
    expandedId.value = id
    expanded.value = true
  }

  const refresh = () => {
    refetching.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      refetching.value = false
    }, 600)
  }

  onBeforeUnmount(() => clearTimeout(refreshTimer))

  const cardQuery = (card: HighlightCard) =>
    [
      'query {',
      `  ${card.dataset}(`,
      '    limit: 5000',
      '    aggregate: { sum: requests }',
      `    filter: { tsRange: { begin: "${currentPeriod.value.begin}", end: "${currentPeriod.value.end}" } }`,
      '    orderBy: [ts_ASC]',
      '  ) {',
      ...['ts', ...card.series.map((entry) => entry.id)].map((field) => `    ${field}`),
      '  }',
      '}'
    ].join('\n')

  const onCardOption = async (card: HighlightCard, value: string | number) => {
    if (value === 'export') {
      const filename = `${card.id}-${currentPeriod.value.value}.csv`
      const csv = toCsv({
        columns: [
          { id: 'ts', header: 'Time' },
          ...card.series.map((entry) => ({ id: entry.id, header: entry.name }))
        ],
        rows: currentPeriod.value.labels.map((label, index) => ({
          ts: label,
          ...Object.fromEntries(card.series.map((entry) => [entry.id, entry.values[index] ?? '']))
        }))
      })
      downloadCsv(filename, csv)
      toast.success('CSV exported.', { description: filename })
      return
    }
    try {
      await globalThis.navigator.clipboard.writeText(cardQuery(card))
      toast.success('Query copied.', {
        description: 'Paste it into any GraphQL client that sends your token.'
      })
    } catch {
      toast.error('The query could not be copied.')
    }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Real-time metrics"
        description="Operational metrics from every product, in near real time."
      >
        <template #actions>
          <Select
            v-model="period"
            size="medium"
            :display-value="periodLabel"
          >
            <Select.Trigger aria-label="Period" />
            <Select.Content>
              <Select.Option
                v-for="option in periodOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
          <Tooltip text="Refresh">
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="medium"
              aria-label="Refresh metrics"
              :loading="refetching"
              @click="refresh"
            />
          </Tooltip>
        </template>
      </PageHeader>

      <section
        :aria-label="`Metrics overview, ${currentPeriod.label}`"
        class="flex min-w-0 flex-col gap-(--layout-group-gap)"
      >
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6"
        >
          <li
            v-for="tile in tiles"
            :key="tile.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              kind="sans"
              :label="tile.label"
              :value="tile.value"
              :format-value="formatters[tile.format]"
              :delta="tile.delta"
              :delta-label="currentPeriod.comparison"
              :inverse="tile.inverse"
              :trend="tile.trend"
            />
          </li>
        </ul>

        <div
          class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
        >
          <ChartCard
            v-for="card in cards"
            :key="card.id"
            :span="6"
          >
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
                <ChartCard.Title>{{ card.title }}</ChartCard.Title>
                <Hint :text="card.hint" />
              </span>
              <ChartCard.Action>
                <span class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex">
                  <Tag
                    label="Sum"
                    severity="neutral"
                    size="small"
                    icon="pi pi-calculator"
                  />
                  <ToggleGroup
                    v-model="forms[card.id]"
                    :options="chartForms"
                    size="small"
                    :aria-label="`Chart form for ${card.title}`"
                  />
                </span>
                <Tooltip text="Expand">
                  <IconButton
                    icon="pi pi-window-maximize"
                    kind="transparent"
                    size="small"
                    :aria-label="`Expand ${card.title}`"
                    @click="openExpanded(card.id)"
                  />
                </Tooltip>
                <DropdownMenu
                  placement="bottom-end"
                  @select="(_event, value) => onCardOption(card, value)"
                >
                  <DropdownMenu.Trigger>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="transparent"
                      size="small"
                      :aria-label="`More options for ${card.title}`"
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="query"
                      label="Copy query"
                    />
                    <DropdownMenu.Item
                      value="export"
                      label="Export CSV"
                    />
                  </DropdownMenu.Group>
                </DropdownMenu>
              </ChartCard.Action>
            </ChartCard.Header>
            <ChartCard.Content>
              <Chart
                v-model:active-index="activeIndex"
                :series="card.series"
                :labels="currentPeriod.labels"
                :format-value="formatters[card.format]"
                :refetching="refetching"
                empty-title="No traffic yet"
                empty-description="Metrics appear here once a product serves requests."
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis kind="x" />
                <Chart.Bar
                  v-if="forms[card.id] === 'bar'"
                  :stacked="card.series.length > 1"
                />
                <Chart.Area v-else-if="card.form === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend total />
              </Chart>
            </ChartCard.Content>
            <ChartCard.Footer>
              <Link
                :label="`Open ${card.product} dashboard`"
                :href="card.href"
                size="medium"
              />
            </ChartCard.Footer>
          </ChartCard>
        </div>
      </section>
    </div>

    <Dialog
      v-model:open="expanded"
      size="large"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DialogTitle>{{ expandedCard?.title }}</DialogTitle>
            <DialogDescription>{{ expandedCard?.hint }}</DialogDescription>
          </div>
        </PanelHeader>
        <PanelContent>
          <div
            v-if="expandedCard"
            class="flex min-w-0 flex-col gap-(--spacing-md)"
          >
            <div>
              <ToggleGroup
                v-model="forms[expandedCard.id]"
                :options="chartForms"
                size="small"
                :aria-label="`Chart form for ${expandedCard.title}`"
              />
            </div>
            <Chart
              :series="expandedCard.series"
              :labels="currentPeriod.labels"
              :format-value="formatters[expandedCard.format]"
              :height="420"
              :aria-label="expandedCard.title"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a product serves requests."
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar
                v-if="forms[expandedCard.id] === 'bar'"
                :stacked="expandedCard.series.length > 1"
              />
              <Chart.Area v-else-if="expandedCard.form === 'area'" />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </div>
        </PanelContent>
      </DialogContent>
    </Dialog>
  </div>
</template>
