<script setup lang="ts">
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, onBeforeUnmount, ref } from 'vue'

  import {
    chartForms,
    metricFormatters,
    runCardOption,
    seriesColumns,
    seriesRows
  } from '../analytics-report'
  import {
    overviewHighlights,
    overviewSummary,
    periods,
    seededFigure,
    seededSeries,
    timeQuery
  } from '../metrics-data'
  import ExpandedDialog from './expanded-dialog.vue'
  import MetricCard from './metric-card.vue'
  import PeriodHeader from './period-header.vue'
  import SeriesChart from './series-chart.vue'
  import TileList from './tile-list.vue'

  const formatters = metricFormatters(useLocale().formatNumber)

  const period = ref('24h')
  const activeIndex = ref<number | null>(null)
  const refetching = ref(false)
  const forms = ref<Record<string, string>>(
    Object.fromEntries(
      overviewHighlights.map((highlight) => [
        highlight.id,
        highlight.form === 'stacked' ? 'bar' : 'line'
      ])
    )
  )
  const expanded = ref(false)
  const expandedId = ref(overviewHighlights[0]?.id ?? '')
  let refreshTimer: ReturnType<typeof setTimeout> | undefined

  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? periods[1]!
  )

  const tiles = computed(() =>
    overviewSummary.map((tile) => ({
      ...tile,
      ...seededFigure(
        `overview:${tile.id}:${currentPeriod.value.value}`,
        tile.base,
        currentPeriod.value,
        tile.rate
      ),
      formatValue: formatters[tile.format]
    }))
  )

  const cards = computed(() =>
    overviewHighlights.map((highlight) => ({
      ...highlight,
      series: seededSeries(`overview:${highlight.id}`, highlight.series, currentPeriod.value)
    }))
  )

  type HighlightCard = (typeof cards.value)[number]

  const expandedCard = computed(
    () => cards.value.find((card) => card.id === expandedId.value) ?? cards.value[0]!
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

  const onCardOption = (card: HighlightCard, value: string | number) =>
    runCardOption(value, {
      query: timeQuery(card.dataset, card.measure, currentPeriod.value),
      filename: `${card.id}-${currentPeriod.value.value}.csv`,
      columns: seriesColumns(card.series),
      rows: () => seriesRows(card.series, currentPeriod.value.labels)
    })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PeriodHeader
        v-model:period="period"
        title="Real-time metrics"
        description="Operational metrics from every product, in near real time."
        :options="periods"
        refreshable
        :refetching="refetching"
        @refresh="refresh"
      />

      <section
        :aria-label="`Metrics overview, ${currentPeriod.label}`"
        class="flex min-w-0 flex-col gap-(--layout-group-gap)"
      >
        <TileList
          :tiles="tiles"
          :comparison="currentPeriod.comparison"
          :columns="6"
          variant="sans"
        />

        <div
          class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
        >
          <MetricCard
            v-for="card in cards"
            :key="card.id"
            v-model:form="forms[card.id]"
            :span="6"
            :title="card.title"
            :hint="card.hint"
            :forms="chartForms"
            fit="xl"
            :footer-label="`Open ${card.product} dashboard`"
            :footer-href="card.href"
            @expand="openExpanded(card.id)"
            @select="(_event, value) => onCardOption(card, value)"
          >
            <SeriesChart
              v-model:active-index="activeIndex"
              :series="card.series"
              :labels="currentPeriod.labels"
              :format-value="formatters[card.format]"
              :bar="forms[card.id] === 'bar'"
              :stacked="card.series.length > 1"
              :shape="card.form === 'area' ? 'area' : 'line'"
              :refetching="refetching"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a product serves requests."
            />
          </MetricCard>
        </div>
      </section>
    </div>

    <ExpandedDialog
      v-model:open="expanded"
      v-model:form="forms[expandedCard.id]"
      :title="expandedCard.title"
      :description="expandedCard.hint"
      :forms="chartForms"
    >
      <SeriesChart
        :series="expandedCard.series"
        :labels="currentPeriod.labels"
        :format-value="formatters[expandedCard.format]"
        :bar="forms[expandedCard.id] === 'bar'"
        :stacked="expandedCard.series.length > 1"
        :shape="expandedCard.form === 'area' ? 'area' : 'line'"
        :height="420"
        :aria-label="expandedCard.title"
        empty-title="No traffic yet"
        empty-description="Metrics appear here once a product serves requests."
      />
    </ExpandedDialog>
  </div>
</template>
