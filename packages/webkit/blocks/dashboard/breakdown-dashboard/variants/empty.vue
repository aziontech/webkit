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
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { ref } from 'vue'

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
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'compute',
      label: 'Compute',
      description: 'Spend on compute this month, the share of the total it carries.',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'database',
      label: 'Database',
      description: 'Spend on database this month, the share of the total it carries.',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'storage',
      label: 'Storage',
      description: 'Spend on storage this month, the share of the total it carries.',
      value: null,
      delta: null,
      trend: []
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

  const series: ChartSeries[] = []

  const split: ChartSeries[] = []

  const contributors: Contributor[] = []

  const contributorColumns: TableColumn[] = [
    {
      id: 'rank',
      accessorKey: 'rank',
      header: 'Rank',
      align: 'start',
      sortable: true,
      minWidth: 64
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      align: 'start',
      sortable: true,
      principal: true,
      grow: 2
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Category',
      align: 'start',
      sortable: true,
      minWidth: 120
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'Amount',
      align: 'end',
      sortable: true,
      minWidth: 104
    },
    {
      id: 'share',
      accessorKey: 'share',
      header: 'Share of total',
      align: 'start',
      sortable: true,
      minWidth: 160
    },
    {
      id: 'change',
      accessorKey: 'change',
      header: 'Change',
      align: 'end',
      sortable: true,
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
            icon="ai ai-download"
            variant="outline"
            size="medium"
            disabled
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
              <Hint :content="figure.description" />
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
                content="Monthly spend stacked by category; the top edge is the total. Legend totals sum the whole range."
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
                side="bottom"
                align="end"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Spend by category"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    disabled
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
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Current split</ChartCard.Title>
              <Hint content="This month’s spend by category, with the total in the center." />
            </span>
            <ChartCard.Action>
              <DropdownMenu
                side="bottom"
                align="end"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Current split"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    disabled
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
                content="The resources that cost the most this month, their share of the total and the change against last month."
              />
            </span>
            <ChartCard.Action>
              <DropdownMenu
                side="bottom"
                align="end"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Top contributors"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    disabled
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
              sortable
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
