<script setup lang="ts">
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import { sampleFractions, sampleTrends, sampleVitals } from '../sample'

  const periods: { value: string; label: string }[] = [
    { value: '1h', label: 'Last hour' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' }
  ]

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
    sampleTrends.map((panel) => {
      const [min, max] = panel.range
      const values = sampleFractions(`${panel.label}:${period.value}`, 24).map(
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
            v-for="vital in sampleVitals"
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
