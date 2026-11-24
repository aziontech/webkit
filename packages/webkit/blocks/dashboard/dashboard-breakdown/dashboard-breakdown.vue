<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { toast } from '@aziontech/webkit/toast'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  import ContributorsTable from './parts/contributors-table.vue'
  import SpendCard from './parts/spend-card.vue'
  import { sampleContributors, sampleKpis, sampleLabels, sampleSeries, sampleSplit } from './sample'

  /** A summary tile. */
  export type BreakdownDashboardMetric = 'total' | 'compute' | 'database' | 'storage'

  /** The figure a summary tile shows. */
  export interface BreakdownDashboardKpi {
    /** Spend this month in USD; null reads as a dash. */
    value: number | null
    /** Percent change against last month; null hides the delta. */
    delta: number | null
    /** Monthly spend over the range, drawn as the tile sparkline, null for an interval with no data. */
    trend: (number | null)[]
  }

  /** The figures of the summary tiles, by metric; a metric left out reads as a dash. */
  export type BreakdownDashboardKpis = Partial<
    Record<BreakdownDashboardMetric, BreakdownDashboardKpi>
  >

  /** One row of Top contributors. */
  export interface BreakdownDashboardContributor {
    /** Stable key. */
    id: string
    /** Position by spend, 1 for the largest. */
    rank: number
    /** The resource name. */
    name: string
    /** Icon class of the resource kind. */
    icon: string
    /** The spend category it bills to. */
    category: string
    /** Spend this month in USD. */
    amount: number
    /** Percent of the total spend. */
    share: number
    /** Percent change against last month. */
    change: number
  }

  /** A card whose data can be exported as CSV. */
  export type BreakdownDashboardCard = 'spend-by-category' | 'current-split' | 'top-contributors'

  export interface BreakdownDashboardProps {
    /** The summary tile figures. Left out, the sample renders. */
    kpis?: BreakdownDashboardKpis
    /** The month labels of Spend by category. Left out, the sample renders. */
    labels?: string[]
    /** Monthly spend, one series per category. Left out, the sample renders. */
    series?: ChartSeries[]
    /** This month's spend by category, one value per series. Left out, the sample renders. */
    split?: ChartSeries[]
    /** The resources that cost the most this month. Left out, the sample renders. */
    contributors?: BreakdownDashboardContributor[]
    /** The period is loading: every tile, chart and the table show their skeleton. */
    loading?: boolean
    /** Why the period could not load, after the name of each card in its danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<BreakdownDashboardProps>(), {
    kpis: undefined,
    labels: undefined,
    series: undefined,
    split: undefined,
    contributors: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    export: [event: Event, card: BreakdownDashboardCard]
  }>()

  const period = defineModel<string>('period', { default: '12m' })

  const comparison = 'this month vs previous month'

  const tiles: { metric: BreakdownDashboardMetric; label: string; description: string }[] = [
    {
      metric: 'total',
      label: 'Total spend',
      description: 'Everything billed to the organization this month.'
    },
    {
      metric: 'compute',
      label: 'Compute',
      description: 'Spend on compute this month, the share of the total it carries.'
    },
    {
      metric: 'database',
      label: 'Database',
      description: 'Spend on database this month, the share of the total it carries.'
    },
    {
      metric: 'storage',
      label: 'Storage',
      description: 'Spend on storage this month, the share of the total it carries.'
    }
  ]

  const blocked = computed(() => props.loading || props.error !== '')
  const kpis = computed(() => props.kpis ?? (blocked.value ? {} : sampleKpis))
  const labels = computed(() => props.labels ?? (blocked.value ? [] : sampleLabels))
  const series = computed(() => props.series ?? (blocked.value ? [] : sampleSeries))
  const split = computed(() => props.split ?? (blocked.value ? [] : sampleSplit))
  const contributors = computed(
    () => props.contributors ?? (blocked.value ? [] : sampleContributors)
  )
  const exportable = computed(
    () =>
      !blocked.value &&
      (series.value.length > 0 || split.value.length > 0 || contributors.value.length > 0)
  )

  const periods = [
    {
      label: 'Last 12 months',
      value: '12m'
    },
    {
      label: 'Last 6 months',
      value: '6m'
    },
    {
      label: 'This year',
      value: 'ytd'
    }
  ]

  const forms = [
    {
      label: 'Area',
      value: 'area'
    },
    {
      label: 'Bar',
      value: 'bar'
    }
  ]

  const { formatNumber } = useLocale()

  const spendFormat = (value: number) =>
    formatNumber(value, {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    })

  const formatters = {
    spend: (value: number) => spendFormat(value)
  }

  const trendForm = ref('area')

  const csvColumns = (headers: Record<string, string>): CsvColumn[] =>
    Object.entries(headers).map(([id, header]) => ({ id, header }))

  interface CsvReport {
    columns: () => CsvColumn[]
    rows: () => object[]
  }

  const reports: Record<BreakdownDashboardCard, CsvReport> = {
    'spend-by-category': {
      columns: () => [
        ...csvColumns({ month: 'Month' }),
        ...series.value.map((entry) => ({ id: entry.id, header: entry.name }))
      ],
      rows: () =>
        labels.value.map((month, index) => ({
          month,
          ...Object.fromEntries(series.value.map((entry) => [entry.id, entry.values[index] ?? '']))
        }))
    },
    'current-split': {
      columns: () => csvColumns({ category: 'Category', amount: 'Spend (USD)' }),
      rows: () =>
        split.value.map((entry) => ({ category: entry.name, amount: entry.values[0] ?? '' }))
    },
    'top-contributors': {
      columns: () =>
        csvColumns({
          rank: 'Rank',
          name: 'Resource',
          category: 'Category',
          amount: 'Spend (USD)',
          share: 'Share (%)',
          change: 'Change (%)'
        }),
      rows: () => contributors.value
    }
  }

  const periodSlug = computed(() =>
    (periods.find((option) => option.value === period.value)?.label ?? 'period')
      .toLowerCase()
      .replaceAll(' ', '-')
  )

  const exportCsv = (event: Event, card: BreakdownDashboardCard) => {
    emit('export', event, card)
    const filename = `${card}-${periodSlug.value}.csv`
    try {
      const report = reports[card]
      downloadCsv(filename, toCsv({ columns: report.columns(), rows: report.rows() }))
      toast.success('CSV exported.', { description: filename })
    } catch {
      toast.error('The CSV could not be exported.', { description: 'Try again in a moment.' })
    }
  }

  const onCardOption = (event: Event, card: BreakdownDashboardCard, value: string | number) => {
    if (value === 'export') exportCsv(event, card)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--spacing-lg)">
      <PageHeader
        title="Cost breakdown"
        description="How the organization’s spend splits across categories and the resources that drive it."
      >
        <template #actions>
          <div class="shrink-0">
            <Select
              variant="ghost"
              v-model="period"
              size="medium"
              :display-value="
                (value) => periods.find((option) => option.value === value)?.label ?? String(value)
              "
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
          </div>
          <Button
            label="Export CSV"
            icon="az az-download"
            variant="outline"
            size="medium"
            :disabled="!exportable"
            @click="(event: MouseEvent) => exportCsv(event, 'spend-by-category')"
          />
        </template>
      </PageHeader>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load the cost breakdown. ${error}`"
        action-label="Retry"
        data-testid="dashboard-breakdown__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />

      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="tile in tiles"
          :key="tile.metric"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="tile.label"
            :value="kpis[tile.metric]?.value ?? null"
            :format-value="formatters.spend"
            :delta="kpis[tile.metric]?.delta ?? null"
            :delta-label="comparison"
            inverse
            :trend="kpis[tile.metric]?.trend ?? []"
            :loading="loading"
            :error="error"
          >
            <template #aside>
              <Hint :content="tile.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <SpendCard
          v-model:form="trendForm"
          :span="8"
          title="Spend by category"
          hint="Monthly spend stacked by category over the period picked in the header; the top edge is the total. Legend totals sum the whole range."
          :forms="forms"
          :exportable="exportable"
          :error="error"
          @select="(event, value) => onCardOption(event, 'spend-by-category', value)"
        >
          <Chart
            :series="series"
            :labels="labels"
            :format-value="formatters.spend"
            empty-title="No spend in this range"
            empty-description="Nothing was billed to the organization in the selected period."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis type="y" />
            <Chart.Axis type="x" />
            <Chart.Bar
              v-if="trendForm === 'bar'"
              stacked
            />
            <Chart.Area
              v-else
              stacked
            />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend total />
          </Chart>
        </SpendCard>

        <SpendCard
          :span="4"
          title="Current split"
          hint="This month’s spend by category, with the total in the center."
          :exportable="exportable"
          :error="error"
          @select="(event, value) => onCardOption(event, 'current-split', value)"
        >
          <DonutChart
            :series="split"
            :format-value="formatters.spend"
            total-label="This month"
            empty-title="No spend in this range"
            empty-description="Nothing was billed to the organization in the selected period."
            :loading="loading"
            aria-label="Current split"
          />
        </SpendCard>

        <SpendCard
          :span="12"
          title="Top contributors"
          hint="The resources that cost the most this month, their share of the total and the change against last month."
          :exportable="exportable"
          :error="error"
          @select="(event, value) => onCardOption(event, 'top-contributors', value)"
        >
          <ContributorsTable
            :contributors="contributors"
            :loading="loading"
          />
        </SpendCard>
      </div>
    </div>
  </div>
</template>
