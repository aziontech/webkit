<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Progress from '@aziontech/webkit/progress'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  interface Contributor {
    id: string
    rank: number
    name: string
    icon: string
    category: string
    amount: number
    share: number
    change: number
  }

  const loading = false
  const comparison = 'vs previous month'

  const figures = [
    {
      id: 'total',
      label: 'Total spend',
      description: 'Everything billed to the organization this month.',
      value: 38500,
      delta: 4.05,
      trend: [27600, 28100, 29000, 29900, 31000, 31700, 32700, 33700, 34700, 35600, 37000, 38500]
    },
    {
      id: 'compute',
      label: 'Compute',
      description: 'Spend on compute this month, the share of the total it carries.',
      value: 16900,
      delta: 4.32,
      trend: [11800, 12100, 12400, 12900, 13300, 13700, 14200, 14600, 15100, 15500, 16200, 16900]
    },
    {
      id: 'database',
      label: 'Database',
      description: 'Spend on database this month, the share of the total it carries.',
      value: 9400,
      delta: 3.3,
      trend: [7200, 7300, 7500, 7600, 7800, 8000, 8100, 8300, 8600, 8800, 9100, 9400]
    },
    {
      id: 'storage',
      label: 'Storage',
      description: 'Spend on storage this month, the share of the total it carries.',
      value: 6000,
      delta: 3.45,
      trend: [4100, 4300, 4400, 4600, 4800, 5000, 5100, 5300, 5500, 5600, 5800, 6000]
    }
  ]

  const labels = [
    'Dec',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov'
  ]

  const series: ChartSeries[] = [
    {
      id: 'compute',
      name: 'Compute',
      values: [11800, 12100, 12400, 12900, 13300, 13700, 14200, 14600, 15100, 15500, 16200, 16900]
    },
    {
      id: 'database',
      name: 'Database',
      values: [7200, 7300, 7500, 7600, 7800, 8000, 8100, 8300, 8600, 8800, 9100, 9400]
    },
    {
      id: 'storage',
      name: 'Storage',
      values: [4100, 4300, 4400, 4600, 4800, 5000, 5100, 5300, 5500, 5600, 5800, 6000]
    },
    {
      id: 'networking',
      name: 'Networking',
      values: [3000, 2900, 3100, 3200, 3400, 3300, 3500, 3700, 3600, 3800, 3900, 4100]
    },
    {
      id: 'monitoring',
      name: 'Monitoring',
      values: [1500, 1500, 1600, 1600, 1700, 1700, 1800, 1800, 1900, 1900, 2000, 2100]
    }
  ]

  const split: ChartSeries[] = [
    {
      id: 'compute',
      name: 'Compute',
      values: [16900]
    },
    {
      id: 'database',
      name: 'Database',
      values: [9400]
    },
    {
      id: 'storage',
      name: 'Storage',
      values: [6000]
    },
    {
      id: 'networking',
      name: 'Networking',
      values: [4100]
    },
    {
      id: 'monitoring',
      name: 'Monitoring',
      values: [2100]
    }
  ]

  const contributors: Contributor[] = [
    {
      id: 'web-app',
      rank: 1,
      name: 'web-app',
      icon: 'ai ai-server',
      category: 'Compute',
      amount: 6200,
      share: 16.1,
      change: 5.08
    },
    {
      id: 'worker-pool',
      rank: 2,
      name: 'worker-pool',
      icon: 'ai ai-server',
      category: 'Compute',
      amount: 5900,
      share: 15.3,
      change: 5.36
    },
    {
      id: 'orders-db',
      rank: 3,
      name: 'orders-db',
      icon: 'ai ai-database',
      category: 'Database',
      amount: 5400,
      share: 14,
      change: 5.88
    },
    {
      id: 'api-service',
      rank: 4,
      name: 'api-service',
      icon: 'ai ai-server',
      category: 'Compute',
      amount: 4800,
      share: 12.5,
      change: 2.13
    },
    {
      id: 'analytics-warehouse',
      rank: 5,
      name: 'analytics-warehouse',
      icon: 'ai ai-database',
      category: 'Database',
      amount: 4000,
      share: 10.4,
      change: 0
    },
    {
      id: 'media-files',
      rank: 6,
      name: 'media-files',
      icon: 'ai ai-folder',
      category: 'Storage',
      amount: 3700,
      share: 9.6,
      change: 8.82
    },
    {
      id: 'public-egress',
      rank: 7,
      name: 'public-egress',
      icon: 'ai ai-globe',
      category: 'Networking',
      amount: 2600,
      share: 6.8,
      change: 4
    },
    {
      id: 'backups',
      rank: 8,
      name: 'backups',
      icon: 'ai ai-folder',
      category: 'Storage',
      amount: 2300,
      share: 6,
      change: -4.17
    },
    {
      id: 'logs-pipeline',
      rank: 9,
      name: 'logs-pipeline',
      icon: 'ai ai-chart-line',
      category: 'Monitoring',
      amount: 2100,
      share: 5.5,
      change: 5
    },
    {
      id: 'load-balancer',
      rank: 10,
      name: 'load-balancer',
      icon: 'ai ai-globe',
      category: 'Networking',
      amount: 1500,
      share: 3.9,
      change: 7.14
    }
  ]

  const contributorColumns: TableColumn[] = [
    {
      id: 'rank',
      accessorKey: 'rank',
      header: 'Rank',
      align: 'start',
      enableSorting: true,
      minWidth: 64
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      align: 'start',
      enableSorting: true,
      principal: true,
      grow: 2
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Category',
      align: 'start',
      enableSorting: true,
      minWidth: 120
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'Amount',
      align: 'end',
      enableSorting: true,
      minWidth: 104
    },
    {
      id: 'share',
      accessorKey: 'share',
      header: 'Share of total',
      align: 'start',
      enableSorting: true,
      minWidth: 160
    },
    {
      id: 'change',
      accessorKey: 'change',
      header: 'Change',
      align: 'end',
      enableSorting: true,
      minWidth: 104
    }
  ]

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

  const amountFormat = (value: number) =>
    formatNumber(value, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    })

  const formatters = {
    spend: (value: number) => spendFormat(value),
    amount: (value: number) => amountFormat(value),
    share: (value: number) => `${value.toFixed(1)}%`,
    change: (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const period = ref('12m')
  const trendForm = ref('area')

  type CardId = 'spend-by-category' | 'current-split' | 'top-contributors'

  interface CsvReport {
    columns: CsvColumn[]
    rows: () => object[]
  }

  const reports: Record<CardId, CsvReport> = {
    'spend-by-category': {
      columns: [
        { id: 'month', header: 'Month' },
        ...series.map((entry) => ({ id: entry.id, header: entry.name }))
      ],
      rows: () =>
        labels.map((month, index) => ({
          month,
          ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
        }))
    },
    'current-split': {
      columns: [
        { id: 'category', header: 'Category' },
        { id: 'amount', header: 'Spend (USD)' }
      ],
      rows: () => split.map((entry) => ({ category: entry.name, amount: entry.values[0] ?? '' }))
    },
    'top-contributors': {
      columns: [
        { id: 'rank', header: 'Rank' },
        { id: 'name', header: 'Resource' },
        { id: 'category', header: 'Category' },
        { id: 'amount', header: 'Spend (USD)' },
        { id: 'share', header: 'Share (%)' },
        { id: 'change', header: 'Change (%)' }
      ],
      rows: () => contributors
    }
  }

  const periodSlug = computed(() =>
    (periods.find((option) => option.value === period.value)?.label ?? 'period')
      .toLowerCase()
      .replaceAll(' ', '-')
  )

  const exportCsv = (id: CardId) => {
    const filename = `${id}-${periodSlug.value}.csv`
    try {
      const report = reports[id]
      downloadCsv(filename, toCsv({ columns: report.columns, rows: report.rows() }))
      toast.success('CSV exported.', { description: filename })
    } catch {
      toast.error('The CSV could not be exported.', { description: 'Try again in a moment.' })
    }
  }

  const onCardOption = (id: CardId, value: string | number) => {
    if (value === 'export') exportCsv(id)
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
          <div class="w-full md:w-48">
            <Select
              v-model="period"
              size="medium"
              :display-value="
                (value) => periods.find((option) => option.value === value)?.label ?? String(value)
              "
            >
              <Select.Trigger aria-label="Period" />
              <Select.Content>
                <Select.Option
                  v-for="option in periods"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
          <Button
            label="Export CSV"
            icon="ai ai-download"
            kind="outlined"
            size="medium"
            :disabled="loading"
            @click="exportCsv('spend-by-category')"
          />
        </template>
      </PageHeader>

      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="figure in figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="formatters.spend"
            :delta="figure.delta"
            :delta-label="comparison"
            inverse
            :trend="figure.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint :text="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Spend by category</ChartCard.Title>
              <Hint
                text="Monthly spend stacked by category; the top edge is the total. Legend totals sum the whole range."
              />
            </span>
            <ChartCard.Action>
              <ToggleGroup
                v-model="trendForm"
                :options="forms"
                size="small"
                aria-label="Chart form for Spend by category"
              />
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('spend-by-category', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Spend by category"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    :disabled="loading"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="series"
              :labels="labels"
              :format-value="formatters.spend"
              empty-title="No spend in this range"
              empty-description="Nothing was billed to the organization in the selected period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
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
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Current split</ChartCard.Title>
              <Hint text="This month’s spend by category, with the total in the center." />
            </span>
            <ChartCard.Action>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('current-split', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Current split"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    :disabled="loading"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <DonutChart
              :series="split"
              :format-value="formatters.spend"
              total-label="This month"
              empty-title="No spend in this range"
              empty-description="Nothing was billed to the organization in the selected period."
              :loading="loading"
              aria-label="Current split"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Top contributors</ChartCard.Title>
              <Hint
                text="The resources that cost the most this month, their share of the total and the change against last month."
              />
            </span>
            <ChartCard.Action>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('top-contributors', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Top contributors"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    :disabled="loading"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <DataTable
              :data="contributors"
              :columns="contributorColumns"
              row-key="id"
              enable-sorting
              density="compact"
              bordered
              :loading="loading"
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="ai ai-chart-bar"
                  title="No spend in this range"
                  description="Nothing was billed to the organization in the selected period."
                />
              </template>

              <template #cell-rank="{ row }">
                <span class="tabular-nums text-(--text-muted)">{{ row.rank }}</span>
              </template>

              <template #cell-name="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    :class="row.icon"
                    class="shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ row.name }}</span>
                </div>
              </template>

              <template #cell-category="{ row }">
                <Tag
                  :label="row.category"
                  severity="neutral"
                  size="small"
                />
              </template>

              <template #cell-amount="{ row }">
                <span class="tabular-nums">{{ formatters.amount(row.amount) }}</span>
              </template>

              <template #cell-share="{ row }">
                <div class="flex w-full min-w-0 items-center gap-(--spacing-sm)">
                  <div class="w-16 shrink-0">
                    <Progress
                      :value="row.share"
                      size="small"
                      :aria-label="row.name + ' share of total'"
                    />
                  </div>
                  <span class="tabular-nums">{{ formatters.share(row.share) }}</span>
                </div>
              </template>

              <template #cell-change="{ row }">
                <Tag
                  :label="formatters.change(row.change)"
                  :severity="row.change > 0 ? 'danger' : row.change < 0 ? 'success' : 'neutral'"
                  :icon="
                    row.change > 0
                      ? 'ai ai-arrow-up-right'
                      : row.change < 0
                        ? 'ai ai-arrow-down-right'
                        : 'ai ai-minus'
                  "
                  size="small"
                />
              </template>
            </DataTable>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
