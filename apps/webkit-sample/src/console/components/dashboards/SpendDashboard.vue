<script setup lang="ts">
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
  import { toast } from '@aziontech/webkit/toast'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  import {
    changeIcon,
    changeSeverity,
    resolveSpendContributors,
    resolveSpendFigures,
    resolveSpendLabels,
    resolveSpendSeries,
    resolveSpendSplit,
    SPEND_COMPARISON,
    SPEND_CONTRIBUTOR_COLUMNS,
    SPEND_DEFAULT_RANGE,
    SPEND_EMPTY,
    SPEND_FORMATTERS,
    SPEND_FORMS,
    SPEND_RANGES
  } from '../../lib/data/dashboards/spend'

  interface Props {
    period: string
    comparison: string
    loading?: boolean
    refetching?: boolean
    empty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    refetching: false,
    empty: false
  })

  const range = ref(SPEND_DEFAULT_RANGE)
  const trendForm = ref('area')

  const figures = computed(() => resolveSpendFigures(range.value, { empty: props.empty }))
  const labels = computed(() => resolveSpendLabels(range.value))
  const series = computed(() => resolveSpendSeries(range.value, { empty: props.empty }))
  const split = computed(() => resolveSpendSplit({ empty: props.empty }))
  const contributors = computed(() => resolveSpendContributors({ empty: props.empty }))

  const rangeLabel = (value: string) =>
    SPEND_RANGES.find((option) => option.value === value)?.label ?? value

  const exportFile = (name: string, csv: string) => {
    const fileName = `spend-${name}-${range.value}.csv`
    downloadCsv(fileName, csv)
    toast.success('CSV exported.', { description: fileName })
  }

  const exportByProduct = () =>
    exportFile(
      'by-product',
      toCsv({
        columns: [
          { id: 'month', header: 'Month' },
          ...series.value.map((entry) => ({ id: entry.id, header: entry.name }))
        ],
        rows: labels.value.map((month, index) => ({
          month,
          ...Object.fromEntries(series.value.map((entry) => [entry.id, entry.values[index]]))
        }))
      })
    )

  const exportSplit = () =>
    exportFile(
      'current-split',
      toCsv({
        columns: [
          { id: 'name', header: 'Product' },
          { id: 'amount', header: 'Amount' }
        ],
        rows: split.value.map((entry) => ({ name: entry.name, amount: entry.values[0] }))
      })
    )

  const exportContributors = () =>
    exportFile(
      'top-contributors',
      toCsv({
        columns: SPEND_CONTRIBUTOR_COLUMNS.map((column) => ({
          id: column.id,
          header: column.header
        })),
        rows: contributors.value
      })
    )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <div class="flex flex-wrap items-center justify-end gap-(--spacing-sm) md:flex-nowrap">
      <div class="w-full md:w-48">
        <Select
          v-model="range"
          size="medium"
          :display-value="rangeLabel"
        >
          <Select.Trigger aria-label="Billing range" />
          <Select.Content>
            <Select.Option
              v-for="option in SPEND_RANGES"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
      <div class="w-full md:w-auto">
        <Button
          label="Export CSV"
          icon="pi pi-download"
          kind="outlined"
          size="medium"
          :disabled="loading"
          @click="exportByProduct"
        />
      </div>
    </div>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
      <li
        v-for="figure in figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="figure.value"
          :format-value="SPEND_FORMATTERS.spend"
          :delta="figure.delta"
          :delta-label="SPEND_COMPARISON"
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
            <ChartCard.Title>Spend by product</ChartCard.Title>
            <Hint
              text="Monthly spend stacked by product; the top edge is the total. Legend totals sum the whole range."
            />
          </span>
          <ChartCard.Controls>
            <SegmentedButton
              v-model="trendForm"
              :options="SPEND_FORMS"
              size="small"
              aria-label="Chart form for Spend by product"
            />
            <Dropdown
              placement="bottom-end"
              @select="exportByProduct"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Spend by product"
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
            :format-value="SPEND_FORMATTERS.spend"
            :empty-title="SPEND_EMPTY.title"
            :empty-description="SPEND_EMPTY.description"
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
            <Hint text="This month’s spend by product, with the total in the center." />
          </span>
          <ChartCard.Controls>
            <Dropdown
              placement="bottom-end"
              @select="exportSplit"
            >
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
            :format-value="SPEND_FORMATTERS.spend"
            total-label="This month"
            :empty-title="SPEND_EMPTY.title"
            :empty-description="SPEND_EMPTY.description"
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
            <Dropdown
              placement="bottom-end"
              @select="exportContributors"
            >
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
            :columns="SPEND_CONTRIBUTOR_COLUMNS"
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
                :title="SPEND_EMPTY.title"
                :description="SPEND_EMPTY.description"
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
              <span class="tabular-nums">{{ SPEND_FORMATTERS.amount(row.amount) }}</span>
            </template>

            <template #cell-share="{ row }">
              <div class="flex w-full min-w-0 items-center gap-(--spacing-sm)">
                <div class="w-16 shrink-0">
                  <ProgressBar
                    :value="row.share"
                    size="small"
                    :aria-label="`${row.name} share of total`"
                  />
                </div>
                <span class="tabular-nums">{{ SPEND_FORMATTERS.share(row.share) }}</span>
              </div>
            </template>

            <template #cell-change="{ row }">
              <Tag
                :label="SPEND_FORMATTERS.change(row.change)"
                :severity="changeSeverity(row.change)"
                :icon="changeIcon(row.change)"
                size="small"
              />
            </template>
          </TableRoot>
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
