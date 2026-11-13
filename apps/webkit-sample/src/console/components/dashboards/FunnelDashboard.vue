<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import { toast } from '@aziontech/webkit/toast'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref, watch } from 'vue'

  import {
    FUNNEL_COHORT_COLUMNS,
    FUNNEL_DEFAULT_SEGMENT,
    FUNNEL_FORMATTERS,
    FUNNEL_SEGMENTS,
    FUNNEL_STAGES,
    FUNNEL_STEP_COLUMNS,
    FUNNEL_WEEK_LABELS,
    FUNNEL_WEEKS,
    resolveFunnel,
    segmentHasData
  } from '../../lib/data/dashboards/funnel'

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

  const segment = ref(FUNNEL_DEFAULT_SEGMENT)
  const activeIndex = ref<number | null>(null)

  const view = computed(() => resolveFunnel(props.period, segment.value, { empty: props.empty }))
  const filtered = computed(() => !props.empty && !segmentHasData(segment.value))

  const segmentLabel = (value: string) =>
    FUNNEL_SEGMENTS.find((option) => option.value === value)?.label ?? ''

  const emptyCopy = computed(() =>
    filtered.value
      ? {
          visitors: 'No visitors match these filters',
          cohorts: 'No cohorts match these filters',
          description: 'Choose another segment or widen the period.'
        }
      : {
          visitors: 'No visitors yet',
          cohorts: 'No cohorts yet',
          description: 'The funnel fills in once your applications serve requests.'
        }
  )

  const clearFilters = () => {
    segment.value = FUNNEL_DEFAULT_SEGMENT
  }

  const exportCsv = (
    id: string,
    columns: { id: string; header: string }[],
    rows: Record<string, unknown>[]
  ) => {
    const fileName = `${id}-${segment.value}-${props.period}.csv`
    downloadCsv(fileName, toCsv({ columns, rows }))
    toast.success('CSV exported.', { description: fileName })
  }

  const exportSteps = () =>
    exportCsv(
      'conversion-funnel',
      FUNNEL_STEP_COLUMNS.map((column) => ({ id: column.id, header: column.header })),
      view.value.steps
    )

  const exportCohorts = (id: string) =>
    exportCsv(
      id,
      FUNNEL_COHORT_COLUMNS.map((column) => ({ id: column.id, header: column.header })),
      view.value.cohorts
    )

  watch([() => props.period, segment], () => {
    activeIndex.value = null
  })
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md)">
    <div
      role="group"
      aria-label="Funnel filters"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
    >
      <div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
        <Select
          v-model="segment"
          size="medium"
          :display-value="segmentLabel"
        >
          <Select.Trigger aria-label="Segment" />
          <Select.Content>
            <Select.Option
              v-for="option in FUNNEL_SEGMENTS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </div>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <li
        v-for="figure in view.figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="figure.value"
          :format-value="FUNNEL_FORMATTERS[figure.format]"
          :delta="figure.delta"
          :delta-label="comparison"
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
      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Conversion funnel</ChartCard.Title>
            <Hint
              text="Unique users who reached each step in the period, in order, with the share lost between steps."
            />
          </span>
          <ChartCard.Controls>
            <Dropdown
              placement="bottom-end"
              @select="exportSteps"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Conversion funnel"
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
          <div
            :data-empty="(!loading && !view.steps.length) || null"
            class="grid min-w-0 grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-2 data-empty:xl:grid-cols-1"
          >
            <Chart
              :series="view.funnel"
              :labels="FUNNEL_STAGES"
              orientation="horizontal"
              :format-value="FUNNEL_FORMATTERS.compact"
              :height="200"
              :empty-title="emptyCopy.visitors"
              :empty-description="emptyCopy.description"
              :loading="loading"
              :refetching="refetching"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar labeled />
              <Chart.Tooltip />
              <template
                v-if="filtered"
                #empty-actions
              >
                <Button
                  label="Clear filters"
                  kind="outlined"
                  size="small"
                  @click="clearFilters"
                />
              </template>
            </Chart>

            <TableRoot
              v-if="loading || view.steps.length"
              :data="view.steps"
              :columns="FUNNEL_STEP_COLUMNS"
              row-key="id"
              header-kind="compact"
              border
              :loading="loading"
            >
              <template #cell-users="{ row }">
                <span class="tabular-nums">{{ FUNNEL_FORMATTERS.number(row.users) }}</span>
              </template>
              <template #cell-share="{ row }">
                <span class="tabular-nums">{{ FUNNEL_FORMATTERS.share(row.share) }}</span>
              </template>
              <template #cell-dropoff="{ row }">
                <span
                  v-if="row.dropoff === null"
                  class="text-(--text-muted)"
                >
                  —
                </span>
                <span
                  v-else
                  class="tabular-nums"
                >
                  {{ FUNNEL_FORMATTERS.drop(row.dropoff) }} from {{ row.from }}
                </span>
              </template>
            </TableRoot>
          </div>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Retention by cohort</ChartCard.Title>
            <Hint
              text="Share of each weekly sign-up cohort still active in each week since sign-up."
            />
          </span>
          <ChartCard.Controls>
            <Dropdown
              placement="bottom-end"
              @select="exportCohorts('retention-by-cohort')"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Retention by cohort"
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
            v-model:active-index="activeIndex"
            :series="view.retention"
            :labels="FUNNEL_WEEK_LABELS"
            :max="100"
            :format-value="FUNNEL_FORMATTERS.percent"
            :empty-title="emptyCopy.cohorts"
            :empty-description="emptyCopy.description"
            :loading="loading"
            :refetching="refetching"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Line markers />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend />
            <template
              v-if="filtered"
              #empty-actions
            >
              <Button
                label="Clear filters"
                kind="outlined"
                size="small"
                @click="clearFilters"
              />
            </template>
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Weekly cohorts</ChartCard.Title>
            <Hint
              text="Users who signed up each week, and the share of them active in each week since. A dash marks a week that has not ended yet."
            />
          </span>
          <ChartCard.Controls>
            <Dropdown
              placement="bottom-end"
              @select="exportCohorts('weekly-cohorts')"
            >
              <Dropdown.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Weekly cohorts"
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
            :data="view.cohorts"
            :columns="FUNNEL_COHORT_COLUMNS"
            row-key="id"
            header-kind="compact"
            border
            :loading="loading"
          >
            <template #empty>
              <EmptyState
                size="small"
                :icon="filtered ? 'pi pi-filter-slash' : 'pi pi-users'"
                :title="emptyCopy.cohorts"
                :description="emptyCopy.description"
              >
                <template
                  v-if="filtered"
                  #actions
                >
                  <Button
                    label="Clear filters"
                    kind="outlined"
                    size="small"
                    @click="clearFilters"
                  />
                </template>
              </EmptyState>
            </template>
            <template #cell-size="{ row }">
              <span class="tabular-nums">{{ FUNNEL_FORMATTERS.number(row.size) }}</span>
            </template>
            <template
              v-for="week in FUNNEL_WEEKS"
              :key="week.key"
              #[week.slot]="{ row }"
            >
              <span
                :data-pending="row[week.key] === null || null"
                class="tabular-nums data-pending:text-(--text-muted)"
              >
                {{ FUNNEL_FORMATTERS.percent(row[week.key]) }}
              </span>
            </template>
          </TableRoot>
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
