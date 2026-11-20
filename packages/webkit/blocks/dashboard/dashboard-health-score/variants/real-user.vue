<script setup lang="ts">
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  interface Period {
    value: string
    label: string
  }

  interface Vital {
    id: string
    label: string
    value: number
    unit: string
    decimals: number
    description: string
  }

  interface TrendPanel {
    id: string
    label: string
    unit: string
    range: [number, number]
  }

  const periods: Period[] = [
    { value: '1h', label: 'Last hour' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' }
  ]

  const vitals: Vital[] = [
    {
      id: 'page-load-time',
      label: 'Page load time',
      value: 1.24,
      unit: 's',
      decimals: 2,
      description: 'Median time to load the page, as measured in the browser.'
    },
    {
      id: 'largest-contentful-paint',
      label: 'Largest contentful paint',
      value: 1.86,
      unit: 's',
      decimals: 2,
      description: 'Median time until the largest element on the page is painted, across sessions.'
    },
    {
      id: 'first-input-delay',
      label: 'First input delay',
      value: 18,
      unit: 'ms',
      decimals: 0,
      description: 'Median delay between the first interaction and the page responding to it.'
    },
    {
      id: 'sessions',
      label: 'Sessions',
      value: 412,
      unit: 'K',
      decimals: 0,
      description: 'Real-user sessions measured in the period.'
    }
  ]

  const trendPanels: TrendPanel[] = [
    { id: 'page-load-time', label: 'Page load time', unit: 's', range: [0.9, 2.4] },
    {
      id: 'largest-contentful-paint',
      label: 'Largest contentful paint',
      unit: 's',
      range: [1.2, 3.1]
    },
    { id: 'first-input-delay', label: 'First input delay', unit: 'ms', range: [8, 46] },
    { id: 'sessions', label: 'Sessions', unit: 'K', range: [8, 32] }
  ]

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

  const { formatNumber } = useLocale()

  const formatFixed = (decimals: number) => (value: number) =>
    formatNumber(value, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })

  const formatLatest = (value: number) =>
    value >= 100
      ? formatNumber(Math.round(value))
      : formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const period = ref('24h')

  const periodLabel = (value: string) =>
    periods.find((entry) => entry.value === value)?.label ?? 'Last 24 hours'

  const windowLabel = computed(() => periodLabel(period.value))

  const trends = computed(() =>
    trendPanels.map((panel) => {
      const [min, max] = panel.range
      const values = seeded(`${panel.label}:${period.value}`, 24).map(
        (u) => Math.round((min + u * (max - min)) * 100) / 100
      )
      return { ...panel, values, latest: values.at(-1) ?? null }
    })
  )
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Real-user monitoring"
        description="Real-user timings collected in the browser, for the selected period."
      >
        <template #actions>
          <Select
            variant="ghost"
            v-model="period"
            size="medium"
            :display-value="periodLabel"
          >
            <Select.Trigger aria-label="Period" />
            <Select.Content>
              <Select.Item
                v-for="option in periods"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Item>
            </Select.Content>
          </Select>
        </template>
      </PageHeader>

      <section
        :aria-label="`Real-user timings, ${windowLabel}`"
        class="flex min-w-0 flex-col gap-(--layout-group-gap)"
      >
        <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="vital in vitals"
            :key="vital.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              variant="sans"
              :label="vital.label"
              :value="vital.value"
              :unit="vital.unit"
              :format-value="formatFixed(vital.decimals)"
            >
              <template #aside>
                <Hint :content="vital.description" />
              </template>
            </StatTile>
          </li>
        </ul>

        <ul class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2">
          <li
            v-for="panel in trends"
            :key="panel.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              variant="sans"
              :label="panel.label"
              :value="panel.latest"
              :unit="panel.unit"
              :format-value="formatLatest"
              :trend="panel.values"
            >
              <template #aside>
                <span class="shrink-0 text-body-sm text-(--text-muted)">{{ windowLabel }}</span>
              </template>
            </StatTile>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
