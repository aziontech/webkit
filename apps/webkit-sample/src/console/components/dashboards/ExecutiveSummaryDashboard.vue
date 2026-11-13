<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref, watch } from 'vue'

  import {
    resolveSummaryFigures,
    resolveSummaryGoals,
    resolveSummaryNotes,
    resolveSummaryTrends,
    SUMMARY_COMPARISON,
    SUMMARY_DEFAULT_QUARTER,
    SUMMARY_FORMATTERS,
    SUMMARY_MONTHS,
    SUMMARY_QUARTERS
  } from '../../lib/data/dashboards/executive-summary'

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

  const quarter = ref(SUMMARY_DEFAULT_QUARTER)
  const activeIndex = ref<number | null>(null)

  const figures = computed(() => resolveSummaryFigures({ empty: props.empty }))
  const goals = computed(() => resolveSummaryGoals({ empty: props.empty }))
  const trends = computed(() => resolveSummaryTrends({ empty: props.empty }))
  const notes = computed(() => resolveSummaryNotes({ empty: props.empty }))

  const format = (kind: string, value: number) =>
    SUMMARY_FORMATTERS[kind as keyof typeof SUMMARY_FORMATTERS](value)

  const goalShare = (current: number, target: number) => Math.round((current / target) * 100)

  watch(quarter, () => {
    activeIndex.value = null
  })

  const exportSummary = () => {
    const fileName = `executive-summary-${quarter.value.toLowerCase().replace(' ', '-')}.csv`
    downloadCsv(
      fileName,
      toCsv({
        columns: [
          { id: 'metric', header: 'Metric' },
          { id: 'value', header: 'Value' },
          { id: 'delta', header: `Change ${SUMMARY_COMPARISON}` }
        ],
        rows: figures.value.map((figure) => ({
          metric: figure.label,
          value: figure.value,
          delta: figure.delta === null ? '' : `${figure.delta}%`
        }))
      })
    )
    toast.success('CSV exported.', { description: fileName })
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <div class="flex flex-wrap items-center justify-end gap-(--spacing-sm)">
      <div class="w-36">
        <Select
          v-model="quarter"
          size="medium"
        >
          <Select.Trigger aria-label="Quarter" />
          <Select.Content>
            <Select.Option
              v-for="option in SUMMARY_QUARTERS"
              :key="option"
              :value="option"
            >
              {{ option }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
      <Button
        label="Export"
        kind="outlined"
        size="medium"
        icon="pi pi-download"
        :disabled="loading"
        @click="exportSummary"
      />
    </div>

    <section aria-label="Scorecard">
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <li
          v-for="figure in figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="SUMMARY_FORMATTERS[figure.format as keyof typeof SUMMARY_FORMATTERS]"
            :delta="figure.delta"
            :delta-label="SUMMARY_COMPARISON"
            :inverse="figure.inverse"
            :loading="loading"
          >
            <template #aside>
              <Hint :text="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>
    </section>

    <div class="grid grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-12">
      <section
        aria-label="Trends"
        class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] md:grid-cols-2 md:[--chart-grid-columns:2] xl:col-span-8"
      >
        <ChartCard
          v-for="trend in trends"
          :key="trend.id"
          :span="1"
        >
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>{{ trend.title }}</ChartCard.Title>
              <Hint :text="trend.description" />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="trend.change && !loading"
                :label="trend.change.label"
                :severity="trend.change.severity"
                :icon="trend.change.icon"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="trend.series"
              :labels="SUMMARY_MONTHS"
              :min="trend.min"
              :format-value="SUMMARY_FORMATTERS[trend.format as keyof typeof SUMMARY_FORMATTERS]"
              :height="160"
              :empty-title="`No results for ${quarter}`"
              empty-description="Nothing was reported in this period. Choose a later quarter."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis
                kind="x"
                :ticks="4"
              />
              <Chart.Area v-if="trend.mark === 'area'" />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
      </section>

      <div class="flex min-w-0 flex-col gap-(--spacing-md) xl:col-span-4">
        <CardBox :title="`${quarter} goals`">
          <template #content>
            <ul
              v-if="loading"
              aria-busy="true"
              class="flex flex-col gap-(--spacing-md)"
            >
              <li
                v-for="index in 5"
                :key="index"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <Skeleton
                  width="60%"
                  height="1rem"
                />
                <Skeleton height="0.5rem" />
                <Skeleton
                  width="40%"
                  height="0.75rem"
                />
              </li>
            </ul>
            <ul
              v-else-if="goals.length"
              class="flex flex-col gap-(--spacing-md)"
            >
              <li
                v-for="goal in goals"
                :key="goal.id"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
                  <span class="truncate text-label-md text-(--text-default)">
                    {{ goal.label }}
                  </span>
                  <Tag
                    :label="goal.status.label"
                    :severity="goal.status.severity"
                    size="small"
                  />
                </div>
                <ProgressBar
                  :value="goal.current"
                  :max="goal.target"
                  size="small"
                  :aria-label="goal.label"
                  :aria-valuetext="`${format(goal.format, goal.current)} of ${format(goal.format, goal.target)}`"
                />
                <div
                  class="flex items-center justify-between gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                >
                  <span class="tabular-nums">
                    {{ format(goal.format, goal.current) }} of
                    {{ format(goal.format, goal.target) }}
                  </span>
                  <span class="tabular-nums">{{ goalShare(goal.current, goal.target) }}%</span>
                </div>
              </li>
            </ul>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-flag"
              :title="`No goal results for ${quarter}`"
              description="Progress appears once the quarter reports its first month."
            />
          </template>
        </CardBox>

        <CardBox
          title="Commentary"
          :padded="false"
        >
          <template #content>
            <Item.List
              v-if="loading"
              aria-busy="true"
            >
              <Item
                v-for="index in 3"
                :key="index"
                size="small"
                role="listitem"
              >
                <Item.Media>
                  <Skeleton
                    kind="circle"
                    width="2rem"
                    height="2rem"
                  />
                </Item.Media>
                <Item.Content>
                  <div class="flex flex-col gap-(--spacing-xs)">
                    <Skeleton
                      width="45%"
                      height="1rem"
                    />
                    <Skeleton height="2.5rem" />
                  </div>
                </Item.Content>
              </Item>
            </Item.List>
            <Item.List v-else-if="notes.length">
              <Item
                v-for="note in notes"
                :key="note.id"
                size="small"
                role="listitem"
              >
                <Item.Media>
                  <Avatar
                    :label="note.initials"
                    size="medium"
                  />
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ note.author }}</Item.Title>
                  <Item.Description>
                    {{ note.role }} ·
                    <time :datetime="note.date">{{ note.dateLabel }}</time>
                  </Item.Description>
                  <p class="mt-(--spacing-xs) text-pretty text-body-sm text-(--text-default)">
                    {{ note.body }}
                  </p>
                </Item.Content>
              </Item>
            </Item.List>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-comment"
              :title="`No notes for ${quarter}`"
              description="Leads add notes here when they review the quarter."
            />
          </template>
        </CardBox>
      </div>
    </div>
  </div>
</template>
