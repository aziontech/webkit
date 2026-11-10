<script setup>
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

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

  const series = [
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

  const split = [
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

  const contributors = [
    {
      id: 'web-app',
      rank: 1,
      name: 'web-app',
      icon: 'pi pi-server',
      category: 'Compute',
      amount: 6200,
      share: 16.1,
      change: 5.08
    },
    {
      id: 'worker-pool',
      rank: 2,
      name: 'worker-pool',
      icon: 'pi pi-server',
      category: 'Compute',
      amount: 5900,
      share: 15.3,
      change: 5.36
    },
    {
      id: 'orders-db',
      rank: 3,
      name: 'orders-db',
      icon: 'pi pi-database',
      category: 'Database',
      amount: 5400,
      share: 14,
      change: 5.88
    },
    {
      id: 'api-service',
      rank: 4,
      name: 'api-service',
      icon: 'pi pi-server',
      category: 'Compute',
      amount: 4800,
      share: 12.5,
      change: 2.13
    },
    {
      id: 'analytics-warehouse',
      rank: 5,
      name: 'analytics-warehouse',
      icon: 'pi pi-database',
      category: 'Database',
      amount: 4000,
      share: 10.4,
      change: 0
    },
    {
      id: 'media-files',
      rank: 6,
      name: 'media-files',
      icon: 'pi pi-folder',
      category: 'Storage',
      amount: 3700,
      share: 9.6,
      change: 8.82
    },
    {
      id: 'public-egress',
      rank: 7,
      name: 'public-egress',
      icon: 'pi pi-globe',
      category: 'Networking',
      amount: 2600,
      share: 6.8,
      change: 4
    },
    {
      id: 'backups',
      rank: 8,
      name: 'backups',
      icon: 'pi pi-folder',
      category: 'Storage',
      amount: 2300,
      share: 6,
      change: -4.17
    },
    {
      id: 'logs-pipeline',
      rank: 9,
      name: 'logs-pipeline',
      icon: 'pi pi-chart-line',
      category: 'Monitoring',
      amount: 2100,
      share: 5.5,
      change: 5
    },
    {
      id: 'load-balancer',
      rank: 10,
      name: 'load-balancer',
      icon: 'pi pi-globe',
      category: 'Networking',
      amount: 1500,
      share: 3.9,
      change: 7.14
    }
  ]

  const contributorColumns = [
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

  const spendFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  })

  const amountFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  })

  const formatters = {
    spend: (value) => spendFormat.format(value),
    amount: (value) => amountFormat.format(value),
    share: (value) => `${value.toFixed(1)}%`,
    change: (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const period = ref('12m')
  const trendForm = ref('area')
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--spacing-lg)">
      <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
        <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
          <h1 class="text-balance text-heading-sm text-(--text-default)">Cost breakdown</h1>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            How the organization’s spend splits across categories and the resources that drive it.
          </p>
        </div>
        <div
          class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:flex-nowrap"
        >
          <div class="w-full md:w-48">
            <Select
              v-model="period"
              size="medium"
              :display-value="
                (value) => periods.find((option) => option.value === value)?.label ?? value
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
          <div class="w-full md:w-fit">
            <Button
              label="Export CSV"
              icon="pi pi-download"
              kind="outlined"
              size="medium"
              class="w-full"
            />
          </div>
        </div>
      </header>

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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Spend by category</ChartCard.Title>
              <Hint
                text="Monthly spend stacked by category; the top edge is the total. Legend totals sum the whole range."
              />
            </span>
            <ChartCard.Controls>
              <SegmentedButton
                v-model="trendForm"
                :options="forms"
                size="small"
                aria-label="Chart form for Spend by category"
              />
              <Dropdown placement="bottom-end">
                <Dropdown.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Spend by category"
                  />
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option
                    value="export"
                    label="Export CSV"
                  />
                </Dropdown.Group>
              </Dropdown>
            </ChartCard.Controls>
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
              <Chart.Legend totals />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Current split</ChartCard.Title>
              <Hint text="This month’s spend by category, with the total in the center." />
            </span>
            <ChartCard.Controls>
              <Dropdown placement="bottom-end">
                <Dropdown.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Current split"
                  />
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option
                    value="export"
                    label="Export CSV"
                  />
                </Dropdown.Group>
              </Dropdown>
            </ChartCard.Controls>
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Top contributors</ChartCard.Title>
              <Hint
                text="The resources that cost the most this month, their share of the total and the change against last month."
              />
            </span>
            <ChartCard.Controls>
              <Dropdown placement="bottom-end">
                <Dropdown.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Top contributors"
                  />
                </Dropdown.Trigger>
                <Dropdown.Group>
                  <Dropdown.Option
                    value="export"
                    label="Export CSV"
                  />
                </Dropdown.Group>
              </Dropdown>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              :data="contributors"
              :columns="contributorColumns"
              row-key="id"
              enable-sorting
              header-kind="compact"
              border
              :loading="loading"
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="pi pi-chart-bar"
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
                  severity="secondary"
                  size="small"
                />
              </template>

              <template #cell-amount="{ row }">
                <span class="tabular-nums">{{ formatters.amount(row.amount) }}</span>
              </template>

              <template #cell-share="{ row }">
                <div class="flex w-full min-w-0 items-center gap-(--spacing-sm)">
                  <div class="w-16 shrink-0">
                    <ProgressBar
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
                  :severity="row.change > 0 ? 'danger' : row.change < 0 ? 'success' : 'secondary'"
                  :icon="
                    row.change > 0
                      ? 'pi pi-arrow-up-right'
                      : row.change < 0
                        ? 'pi pi-arrow-down-right'
                        : 'pi pi-minus'
                  "
                  size="small"
                />
              </template>
            </TableRoot>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </main>
  </div>
</template>
