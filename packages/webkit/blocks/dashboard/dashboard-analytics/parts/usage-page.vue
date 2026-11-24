<script setup lang="ts">
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import {
    chartForms,
    comparedPeriod,
    comparedPeriods,
    fixedFormatter,
    formatBytes,
    metricQuery,
    periodSlug,
    runCardOption,
    seriesRows
  } from '../analytics-report'
  import {
    sampleUsageComparison,
    sampleUsageFigures,
    sampleUsageProjects,
    sampleUsageRanking
  } from '../sample'
  import ExpandedDialog from './expanded-dialog.vue'
  import ExpandedTable from './expanded-table.vue'
  import MetricCard, { type MetricCardVariation } from './metric-card.vue'
  import PeriodHeader from './period-header.vue'
  import SearchTable from './search-table.vue'
  import SeriesChart from './series-chart.vue'
  import TileList from './tile-list.vue'

  type CardId = 'comparison' | 'projects' | 'usage'

  const period = ref('24h')
  const current = computed(() => comparedPeriod(period.value))

  const { formatNumber } = useLocale()
  const fixed = fixedFormatter(formatNumber)
  const formatCount = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  const formatUsageBytes = (value: number) =>
    formatBytes(value, fixed, ['B', 'KB', 'MB', 'GB', 'TB', 'PB'])

  const tiles = sampleUsageFigures.map((figure) => ({
    ...figure,
    formatValue: figure.unit === 'bytes' ? formatUsageBytes : formatCount
  }))
  const comparison = sampleUsageComparison
  const ranking = sampleUsageRanking
  const rows = sampleUsageProjects
  const empty = {
    emptyTitle: 'No usage yet',
    emptyDescription: 'Usage appears here once a project serves requests.'
  }

  const rise = (comparison.delta ?? 0) > 0
  const variation: MetricCardVariation | null =
    comparison.delta === null
      ? null
      : {
          label: (rise ? '+' : '') + fixed(comparison.delta, 2) + '%',
          severity: rise ? 'success' : 'danger',
          icon: rise ? 'az az-arrow-up-right' : 'az az-arrow-down-left'
        }

  const column = (id: string, header: string, align: 'start' | 'end'): TableColumn => ({
    id,
    accessorKey: id,
    header,
    align,
    sortable: true,
    principal: id === 'project'
  })
  const columns: TableColumn[] = [
    column('project', 'Project', 'start'),
    column('requests', 'Requests', 'end'),
    column('dataTransferred', 'Data transferred', 'end')
  ]

  const form = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  const query = (measure: string, limit: number, groupBy: string[], orderBy: string) =>
    metricQuery({
      dataset: 'workloadMetrics',
      measure,
      limit,
      groupBy,
      orderBy,
      begin: '2026-11-13T00:00:00',
      end: '2026-11-13T23:59:59'
    })

  const reports = {
    comparison: {
      label: 'Data transferred, this period vs previous',
      description:
        'Data delivered by every project in the selected period, drawn over the same span of the previous period.',
      query: query('bytesSent', 10000, ['ts'], 'ts_ASC'),
      columns: [
        { id: 'ts', header: 'Time' },
        { id: 'current', header: 'This period' },
        { id: 'previous', header: 'Previous period' }
      ],
      rows: () => seriesRows(comparison.series, comparison.labels)
    },
    projects: {
      label: 'Data transferred by project',
      description: 'The projects that delivered the most data in the period.',
      query: query('bytesSent', 10, ['configurationId'], 'sum_DESC'),
      columns: [
        { id: 'project', header: 'Project' },
        { id: 'dataTransferred', header: 'Data transferred' }
      ],
      rows: () =>
        ranking.labels.map((project, index) => ({
          project,
          dataTransferred: ranking.series[0]?.values[index] ?? ''
        }))
    },
    usage: {
      label: 'Usage by project',
      description: 'Requests and data transferred per project in the period.',
      query: query('requests', 1000, ['configurationId'], 'sum_DESC'),
      columns: [
        { id: 'project', header: 'Project' },
        { id: 'requests', header: 'Requests' },
        { id: 'dataTransferred', header: 'Data transferred' }
      ],
      rows: () => rows
    }
  }

  const expanded = ref(false)
  const expandedId = ref<CardId>('comparison')
  const expandedReport = computed(() => reports[expandedId.value])

  const openExpanded = (id: CardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const onCardOption = (id: CardId, value: string | number) =>
    runCardOption(value, {
      ...reports[id],
      filename: `${id}-${periodSlug(current.value)}.csv`
    })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PeriodHeader
        v-model:period="period"
        title="Data usage"
        description="What your projects consumed in the period, against the previous period."
        :options="comparedPeriods"
      />
      <TileList
        :tiles="tiles"
        :comparison="current.comparison"
        :columns="3"
      />

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <MetricCard
          v-model:form="form"
          :span="12"
          :title="reports.comparison.label"
          :hint="reports.comparison.description"
          :variation="variation"
          :forms="chartForms"
          wide
          @expand="openExpanded('comparison')"
          @select="(_event, value) => onCardOption('comparison', value)"
        >
          <SeriesChart
            v-model:active-index="activeIndex"
            :series="comparison.series"
            :labels="comparison.labels"
            :format-value="formatUsageBytes"
            :bar="form === 'bar'"
            stacked
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          :span="6"
          :title="reports.projects.label"
          :hint="reports.projects.description"
          @expand="openExpanded('projects')"
          @select="(_event, value) => onCardOption('projects', value)"
        >
          <SeriesChart
            ranking
            :series="ranking.series"
            :labels="ranking.labels"
            :format-value="formatUsageBytes"
            :height="256"
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          :span="6"
          :title="reports.usage.label"
          :hint="reports.usage.description"
          @expand="openExpanded('usage')"
          @select="(_event, value) => onCardOption('usage', value)"
        >
          <SearchTable
            v-model:search="search"
            :rows="rows"
            :columns="columns"
            search-label="Search projects"
            :format-count="formatCount"
            v-bind="empty"
          />
        </MetricCard>
      </div>
    </div>
    <ExpandedDialog
      v-model:open="expanded"
      v-model:form="form"
      :title="expandedReport.label"
      :description="expandedReport.description"
      :forms="expandedId === 'comparison' ? chartForms : []"
    >
      <SeriesChart
        key="chart-1"
        v-if="expandedId === 'comparison'"
        :series="comparison.series"
        :labels="comparison.labels"
        :format-value="formatUsageBytes"
        :bar="form === 'bar'"
        stacked
        :height="420"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <SeriesChart
        key="chart-2"
        v-else-if="expandedId === 'projects'"
        ranking
        :series="ranking.series"
        :labels="ranking.labels"
        :format-value="formatUsageBytes"
        :height="420"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <ExpandedTable
        v-else
        :rows="rows"
        :columns="columns"
        :format-count="formatCount"
        v-bind="empty"
      />
    </ExpandedDialog>
  </div>
</template>
