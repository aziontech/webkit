<script setup lang="ts">
  import Chart, { type ChartColor, type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  type MetricFormat = 'count' | 'bytes' | 'percentage' | 'ms' | 'seconds'
  type PanelForm = 'area' | 'line' | 'stacked'

  interface Period {
    value: string
    label: string
    comparison: string
    scale: number
    labels: string[]
  }

  interface Tile {
    id: string
    label: string
    description: string
    format: MetricFormat
    base: number
    rate?: boolean
    inverse?: boolean
  }

  interface PanelSeries {
    id: string
    name: string
    base: number
    color?: ChartColor
  }

  interface Panel {
    id: string
    title: string
    hint: string
    aggregation: string
    format: MetricFormat
    form: PanelForm
    rate?: boolean
    series: PanelSeries[]
  }

  interface Product {
    id: string
    label: string
    description: string
    tiles: Tile[]
    panels: Panel[]
  }

  const periods: Period[] = [
    {
      value: '1h',
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
      label: 'Last 7 days',
      comparison: 'vs previous 7 days',
      scale: 7,
      labels: ['Nov 4', 'Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9', 'Nov 10']
    },
    {
      value: '30d',
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

  const products: Product[] = [
    {
      id: 'applications',
      label: 'Applications',
      description: 'Requests, data transferred, cache and errors across your applications.',
      tiles: [
        {
          id: 'requests',
          label: 'Requests',
          description: 'Requests your applications served in the period.',
          format: 'count',
          base: 2000000
        },
        {
          id: 'data',
          label: 'Data transferred',
          description: 'Bytes delivered to clients in the period.',
          format: 'bytes',
          base: 9000000000
        },
        {
          id: 'hit-ratio',
          label: 'Cache hit ratio',
          description: 'Share of requests served from cache, not from the origin.',
          format: 'percentage',
          base: 88,
          rate: true
        },
        {
          id: '5xx',
          label: 'Status 5xx',
          description: 'Requests that ended in a server error. A rise is a regression.',
          format: 'count',
          base: 6000,
          inverse: true
        }
      ],
      panels: [
        {
          id: 'requests',
          title: 'Requests',
          hint: 'Sum of requests served by every application, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'area',
          series: [{ id: 'requests', name: 'Requests', base: 2000000 }]
        },
        {
          id: 'data',
          title: 'Data transferred',
          hint: 'Sum of bytes delivered to clients, per interval.',
          aggregation: 'Sum',
          format: 'bytes',
          form: 'area',
          series: [{ id: 'data', name: 'Data transferred', base: 9000000000 }]
        },
        {
          id: 'status',
          title: 'Status codes',
          hint: 'Sum of requests per status class, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'line',
          series: [
            { id: '2xx', name: 'Status 2xx', base: 1700000 },
            { id: '3xx', name: 'Status 3xx', base: 240000 },
            { id: '4xx', name: 'Status 4xx', base: 60000 },
            { id: '5xx', name: 'Status 5xx', base: 6000 }
          ]
        },
        {
          id: 'cache',
          title: 'Cache hits and misses',
          hint: 'Requests served from cache and requests sent to the origin, stacked.',
          aggregation: 'Sum',
          format: 'count',
          form: 'stacked',
          series: [
            { id: 'hits', name: 'Hits', base: 1750000 },
            { id: 'misses', name: 'Misses', base: 250000 }
          ]
        }
      ]
    },
    {
      id: 'functions',
      label: 'Functions',
      description: 'Invocations, errors and duration of your functions.',
      tiles: [
        {
          id: 'invocations',
          label: 'Invocations',
          description: 'Times your functions ran in the period.',
          format: 'count',
          base: 640000
        },
        {
          id: 'errors',
          label: 'Errors',
          description: 'Invocations that threw or timed out. A rise is a regression.',
          format: 'count',
          base: 900,
          inverse: true
        },
        {
          id: 'duration',
          label: 'Duration p95',
          description: '95% of invocations finished within this time.',
          format: 'ms',
          base: 42,
          rate: true,
          inverse: true
        },
        {
          id: 'compute',
          label: 'Compute time',
          description: 'Total time your functions ran in the period.',
          format: 'seconds',
          base: 14000
        }
      ],
      panels: [
        {
          id: 'invocations',
          title: 'Invocations',
          hint: 'Sum of invocations of every function, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'area',
          series: [{ id: 'invocations', name: 'Invocations', base: 640000 }]
        },
        {
          id: 'errors',
          title: 'Errors',
          hint: 'Invocations that threw or timed out, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'area',
          series: [{ id: 'errors', name: 'Errors', base: 900 }]
        },
        {
          id: 'duration',
          title: 'Duration',
          hint: 'Median and 95th percentile duration of an invocation, per interval.',
          aggregation: 'Percentile',
          format: 'ms',
          form: 'line',
          rate: true,
          series: [
            { id: 'p50', name: 'p50', base: 18 },
            { id: 'p95', name: 'p95', base: 42 }
          ]
        },
        {
          id: 'compute',
          title: 'Compute time',
          hint: 'Sum of the time every function ran, per interval.',
          aggregation: 'Sum',
          format: 'seconds',
          form: 'area',
          series: [{ id: 'compute', name: 'Compute time', base: 14000 }]
        }
      ]
    },
    {
      id: 'firewall',
      label: 'Firewall',
      description: 'Requests allowed, denied and rate limited by your firewalls.',
      tiles: [
        {
          id: 'inspected',
          label: 'Requests inspected',
          description: 'Requests your firewalls evaluated in the period.',
          format: 'count',
          base: 1900000
        },
        {
          id: 'denied',
          label: 'Denied',
          description: 'Requests a rule denied in the period.',
          format: 'count',
          base: 42000,
          inverse: true
        },
        {
          id: 'limited',
          label: 'Rate limited',
          description: 'Requests held back by a rate limit in the period.',
          format: 'count',
          base: 8600,
          inverse: true
        },
        {
          id: 'threats',
          label: 'Threats',
          description: 'Requests that matched a threat signature in the period.',
          format: 'count',
          base: 3100,
          inverse: true
        }
      ],
      panels: [
        {
          id: 'decisions',
          title: 'Allowed and denied',
          hint: 'Requests each firewall allowed or denied, stacked per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'stacked',
          series: [
            { id: 'allowed', name: 'Allowed', base: 1850000 },
            { id: 'denied', name: 'Denied', base: 42000, color: 'danger' }
          ]
        },
        {
          id: 'threats',
          title: 'Threats by type',
          hint: 'Requests that matched a threat signature, per family, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'line',
          series: [
            { id: 'sqli', name: 'SQL injection', base: 1200 },
            { id: 'xss', name: 'Cross-site scripting', base: 900 },
            { id: 'traversal', name: 'Path traversal', base: 600 },
            { id: 'bots', name: 'Bad bots', base: 400 }
          ]
        },
        {
          id: 'limited',
          title: 'Rate limited',
          hint: 'Requests held back by a rate limit, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'area',
          series: [{ id: 'limited', name: 'Rate limited', base: 8600 }]
        },
        {
          id: 'inspected',
          title: 'Requests inspected',
          hint: 'Requests your firewalls evaluated, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'area',
          series: [{ id: 'inspected', name: 'Requests inspected', base: 1900000 }]
        }
      ]
    },
    {
      id: 'dns',
      label: 'DNS',
      description: 'Queries your hosted zones answered, and how they were answered.',
      tiles: [
        {
          id: 'queries',
          label: 'Queries',
          description: 'Queries your hosted zones answered in the period.',
          format: 'count',
          base: 5200000
        },
        {
          id: 'nxdomain',
          label: 'NXDOMAIN',
          description: 'Queries for a name that does not exist in the zone.',
          format: 'count',
          base: 74000,
          inverse: true
        },
        {
          id: 'servfail',
          label: 'SERVFAIL',
          description: 'Queries the server failed to answer. A rise is a regression.',
          format: 'count',
          base: 410,
          inverse: true
        },
        {
          id: 'latency',
          label: 'Response time',
          description: 'Median time to answer a query.',
          format: 'ms',
          base: 4,
          rate: true,
          inverse: true
        }
      ],
      panels: [
        {
          id: 'queries',
          title: 'Queries',
          hint: 'Sum of queries answered by every zone, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'area',
          series: [{ id: 'queries', name: 'Queries', base: 5200000 }]
        },
        {
          id: 'codes',
          title: 'Response codes',
          hint: 'Sum of answers per response code, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'line',
          series: [
            { id: 'noerror', name: 'NOERROR', base: 5100000 },
            { id: 'nxdomain', name: 'NXDOMAIN', base: 74000 },
            { id: 'servfail', name: 'SERVFAIL', base: 410 }
          ]
        },
        {
          id: 'types',
          title: 'Query types',
          hint: 'Sum of queries per record type, stacked per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'stacked',
          series: [
            { id: 'a', name: 'A', base: 3100000 },
            { id: 'aaaa', name: 'AAAA', base: 1400000 },
            { id: 'cname', name: 'CNAME', base: 500000 },
            { id: 'txt', name: 'TXT', base: 200000 }
          ]
        },
        {
          id: 'latency',
          title: 'Response time',
          hint: 'Median time to answer a query, per interval.',
          aggregation: 'Median',
          format: 'ms',
          form: 'line',
          rate: true,
          series: [{ id: 'latency', name: 'Response time', base: 4 }]
        }
      ]
    },
    {
      id: 'data-stream',
      label: 'Data stream',
      description: 'Records collected and delivered to your endpoints.',
      tiles: [
        {
          id: 'collected',
          label: 'Records collected',
          description: 'Records your streams collected in the period.',
          format: 'count',
          base: 3600000
        },
        {
          id: 'delivered',
          label: 'Records delivered',
          description: 'Records your endpoints accepted in the period.',
          format: 'count',
          base: 3580000
        },
        {
          id: 'failures',
          label: 'Delivery failures',
          description: 'Batches an endpoint refused or did not answer. A rise is a regression.',
          format: 'count',
          base: 120,
          inverse: true
        },
        {
          id: 'lag',
          label: 'Delivery lag',
          description: 'Median time from collecting a record to its delivery.',
          format: 'ms',
          base: 850,
          rate: true,
          inverse: true
        }
      ],
      panels: [
        {
          id: 'records',
          title: 'Records collected and delivered',
          hint: 'Records collected and records your endpoints accepted, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'line',
          series: [
            { id: 'collected', name: 'Collected', base: 3600000 },
            { id: 'delivered', name: 'Delivered', base: 3580000 }
          ]
        },
        {
          id: 'failures',
          title: 'Delivery failures',
          hint: 'Batches an endpoint refused or did not answer, per interval.',
          aggregation: 'Sum',
          format: 'count',
          form: 'area',
          series: [{ id: 'failures', name: 'Delivery failures', base: 120 }]
        },
        {
          id: 'bytes',
          title: 'Data delivered',
          hint: 'Sum of bytes sent to your endpoints, per interval.',
          aggregation: 'Sum',
          format: 'bytes',
          form: 'area',
          series: [{ id: 'bytes', name: 'Data delivered', base: 4200000000 }]
        },
        {
          id: 'lag',
          title: 'Delivery lag',
          hint: 'Median time from collecting a record to its delivery, per interval.',
          aggregation: 'Median',
          format: 'ms',
          form: 'line',
          rate: true,
          series: [{ id: 'lag', name: 'Delivery lag', base: 850 }]
        }
      ]
    }
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

  const activeProduct = ref<string | number | null>('applications')
  const period = ref('24h')
  const activeIndex = ref<number | null>(null)

  const periodOptions = periods.map(({ value, label }) => ({ value, label }))
  const periodLabel = (value: unknown) =>
    periods.find((entry) => entry.value === value)?.label ?? ''

  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? periods[1]
  )

  const product = computed(
    () => products.find((entry) => entry.id === activeProduct.value) ?? products[0]
  )

  const tiles = computed(() =>
    product.value.tiles.map((tile) => {
      const seed = `${product.value.id}:${tile.id}:${currentPeriod.value.value}`
      const trend = seriesValues(seed, tile.base, currentPeriod.value, tile.rate)
      const value = tile.rate
        ? trend.reduce((sum, point) => sum + point, 0) / trend.length
        : trend.reduce((sum, point) => sum + point, 0)
      const [swing] = seeded(`${seed}:delta`, 1)
      return {
        ...tile,
        trend,
        value,
        delta: Math.round((swing * 30 - 15) * 100) / 100
      }
    })
  )

  const panels = computed(() =>
    product.value.panels.map((panel) => ({
      ...panel,
      series: panel.series.map((entry): ChartSeries => ({
        id: entry.id,
        name: entry.name,
        ...(entry.color ? { color: entry.color } : {}),
        values: seriesValues(
          `${product.value.id}:${panel.id}:${entry.id}:${currentPeriod.value.value}`,
          entry.base,
          currentPeriod.value,
          panel.rate
        )
      }))
    }))
  )

  const selectProduct = (value: string | number | null) => {
    activeProduct.value = value
    activeIndex.value = null
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Real-time metrics"
        :description="product.description"
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
        </template>
      </PageHeader>

      <PageTabs
        :model-value="activeProduct"
        @update:model-value="selectProduct"
      >
        <Tabs.Item
          v-for="entry in products"
          :key="entry.id"
          :value="entry.id"
          :label="entry.label"
        />
      </PageTabs>

      <section
        :aria-label="`${product.label} metrics, ${currentPeriod.label}`"
        class="flex min-w-0 flex-col gap-(--layout-group-gap)"
      >
        <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
          <li
            v-for="tile in tiles"
            :key="`${product.id}-${tile.id}`"
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
            >
              <template #aside>
                <Hint :text="tile.description" />
              </template>
            </StatTile>
          </li>
        </ul>

        <div
          class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
        >
          <ChartCard
            v-for="panel in panels"
            :key="`${product.id}-${panel.id}`"
            :span="6"
          >
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
                <ChartCard.Title>{{ panel.title }}</ChartCard.Title>
                <Hint :text="panel.hint" />
              </span>
              <ChartCard.Controls>
                <span class="hidden items-center gap-(--spacing-xs) sm:flex">
                  <Tag
                    :label="panel.aggregation"
                    severity="secondary"
                    size="small"
                    icon="pi pi-calculator"
                  />
                </span>
                <DropdownMenu placement="bottom-end">
                  <DropdownMenu.Trigger>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="transparent"
                      size="small"
                      :aria-label="`More options for ${panel.title}`"
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="query"
                      label="Copy query"
                    />
                    <DropdownMenu.Option
                      value="export"
                      label="Export CSV"
                    />
                  </DropdownMenu.Group>
                </DropdownMenu>
              </ChartCard.Controls>
            </ChartCard.Header>
            <ChartCard.Content>
              <Chart
                v-model:active-index="activeIndex"
                :series="panel.series"
                :labels="currentPeriod.labels"
                :format-value="formatters[panel.format]"
                empty-title="No traffic yet"
                empty-description="Metrics appear here once this product serves requests."
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis kind="x" />
                <Chart.Bar
                  v-if="panel.form === 'stacked'"
                  stacked
                />
                <Chart.Line v-else-if="panel.form === 'line'" />
                <Chart.Area v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend :totals="!panel.rate" />
              </Chart>
            </ChartCard.Content>
          </ChartCard>
        </div>
      </section>
    </div>
  </div>
</template>
