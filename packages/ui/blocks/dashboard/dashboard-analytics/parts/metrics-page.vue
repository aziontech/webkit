<script setup lang="ts">
  import PageTabs from '@aziontech/ui/page-tabs'
  import Tabs, { type TabsValue } from '@aziontech/ui/tabs'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/ui/toggle-group'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, ref, watch } from 'vue'

  import {
    copyQuery,
    exportCsv,
    hiddenForStatusForm,
    metricFormatters,
    seriesColumns,
    seriesRows,
    statusForms
  } from '../analytics-report'
  import {
    type Breakdown,
    breakdownQuery,
    type BreakdownRow,
    periods,
    products,
    seededFigure,
    seededSeries,
    statusClasses,
    timeQuery
  } from '../metrics-data'
  import MetricCard from './metric-card.vue'
  import PeriodHeader from './period-header.vue'
  import SearchTable from './search-table.vue'
  import SeriesChart from './series-chart.vue'
  import TileList from './tile-list.vue'

  const formatters = metricFormatters(useLocale().formatNumber)

  const activeProduct = ref<TabsValue | null>('applications')
  const view = ref('overview')
  const searches = ref<Record<string, string>>({})
  const classes = ref<Record<string, string>>({})
  const period = ref('24h')
  const activeIndex = ref<number | null>(null)

  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? periods[1]!
  )

  const product = computed(
    () => products.find((entry) => entry.id === activeProduct.value) ?? products[0]!
  )

  const tiles = computed(() =>
    product.value.tiles.map((tile) => ({
      ...tile,
      ...seededFigure(
        `${product.value.id}:${tile.id}:${currentPeriod.value.value}`,
        tile.base,
        currentPeriod.value,
        tile.rate
      ),
      formatValue: formatters[tile.format]
    }))
  )

  const currentView = computed(
    () => product.value.views?.find((entry) => entry.id === view.value) ?? null
  )

  const viewOptions = computed<ToggleGroupOption[]>(
    () => product.value.views?.map(({ id, label }) => ({ label, value: id })) ?? []
  )

  const breakdowns = computed(() => currentView.value?.breakdowns ?? [])

  const panels = computed(() =>
    product.value.panels
      .filter((panel) => !currentView.value || currentView.value.panels.includes(panel.id))
      .map((panel) => ({
        ...panel,
        series: seededSeries(product.value.id, panel.series, currentPeriod.value, panel.rate)
      }))
  )

  type PanelCard = (typeof panels.value)[number]

  const statusForm = ref('bar')
  const hidden = ref<Record<string, string[]>>({})
  watch(
    [statusForm, () => panels.value.find((panel) => panel.id === 'status')?.series ?? []],
    ([form, series]) => (hidden.value['status'] = hiddenForStatusForm(form, series)),
    { immediate: true }
  )

  const sectionLabel = computed(
    () =>
      `${product.value.label} metrics, ${currentView.value ? `${currentView.value.label}, ` : ''}${currentPeriod.value.label}`
  )

  const breakdownRows = (breakdown: Breakdown) => {
    const statusClass = classes.value[breakdown.id] ?? 'all'
    const rows = breakdown.rows.map((row): BreakdownRow => ({
      ...row,
      requests: Math.round(Number(row.requests) * currentPeriod.value.scale)
    }))
    if (!breakdown.classes || statusClass === 'all') return rows
    return rows.filter((row) => String(row.status).startsWith(statusClass))
  }

  const selectProduct = (value: TabsValue | null) => {
    activeProduct.value = value
    activeIndex.value = null
    view.value = 'overview'
  }

  const selectView = (value: string | number | undefined) => {
    view.value = value === undefined ? 'overview' : String(value)
    activeIndex.value = null
  }

  const filename = (id: string) => `${product.value.id}-${id}-${currentPeriod.value.value}.csv`

  const onPanelOption = (panel: PanelCard, value: string | number) => {
    if (value === 'query') {
      copyQuery(timeQuery(product.value.dataset, product.value.measure, currentPeriod.value))
      return
    }
    exportCsv(
      filename(panel.id),
      seriesColumns(panel.series),
      seriesRows(panel.series, currentPeriod.value.labels)
    )
  }

  const onBreakdownOption = (breakdown: Breakdown, value: string | number) => {
    if (value === 'query') {
      copyQuery(breakdownQuery(product.value, breakdown, currentPeriod.value))
      return
    }
    exportCsv(
      filename(breakdown.id),
      breakdown.columns.map((column) => ({
        id: column.id ?? '',
        header: String(column.header ?? '')
      })),
      breakdownRows(breakdown)
    )
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PeriodHeader
        v-model:period="period"
        title="Real-time metrics"
        :description="product.description"
        :options="periods"
      />

      <PageTabs
        :model-value="activeProduct"
        @update:model-value="selectProduct"
      >
        <Tabs.Trigger
          v-for="entry in products"
          :key="entry.id"
          :value="entry.id"
          :label="entry.label"
        />
      </PageTabs>

      <ToggleGroup
        v-if="viewOptions.length > 1"
        :model-value="view"
        :options="viewOptions"
        size="medium"
        :aria-label="`${product.label} dashboards`"
        class="self-start"
        @update:model-value="selectView"
      />

      <section
        :aria-label="sectionLabel"
        class="flex min-w-0 flex-col gap-(--layout-group-gap)"
      >
        <TileList
          :key="product.id"
          :tiles="tiles"
          :comparison="currentPeriod.comparison"
          :columns="4"
          variant="sans"
        />

        <div
          class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
        >
          <MetricCard
            v-for="panel in panels"
            :key="`${product.id}-${panel.id}`"
            :span="6"
            :title="panel.title"
            :hint="panel.hint"
            :aggregation="panel.aggregation"
            fit="sm"
            :expandable="false"
            :forms="panel.id === 'status' ? statusForms : []"
            :form="panel.id === 'status' ? statusForm : ''"
            @update:form="(value) => panel.id === 'status' && (statusForm = value)"
            @select="(_event, value) => onPanelOption(panel, value)"
          >
            <SeriesChart
              v-model:active-index="activeIndex"
              v-model:hidden-series="hidden[panel.id]"
              :series="panel.series"
              :labels="currentPeriod.labels"
              :format-value="formatters[panel.format]"
              :bar="panel.id === 'status' ? statusForm !== 'line' : panel.form === 'stacked'"
              stacked
              :shape="panel.form === 'line' ? 'line' : 'area'"
              :total="!panel.rate"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once this product serves requests."
            />
          </MetricCard>

          <MetricCard
            v-for="breakdown in breakdowns"
            :key="`${product.id}-${breakdown.id}`"
            :span="12"
            :title="breakdown.title"
            :hint="breakdown.hint"
            fit="sm"
            :expandable="false"
            @select="(_event, value) => onBreakdownOption(breakdown, value)"
          >
            <SearchTable
              v-model:search="searches[breakdown.id]"
              v-model:filter="classes[breakdown.id]"
              :rows="breakdownRows(breakdown)"
              :columns="breakdown.columns"
              :search-label="breakdown.search"
              :format-count="formatters.count"
              :filters="breakdown.classes ? statusClasses : []"
              :filter-label="`Filter ${breakdown.title.toLowerCase()} by status class`"
            />
          </MetricCard>
        </div>
      </section>
    </div>
  </div>
</template>
