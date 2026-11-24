<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Button from '@aziontech/webkit/button'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DashboardGrid, { type DashboardGridLayoutItem } from '@aziontech/webkit/dashboard-grid'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import { sampleLabels, sampleSeries, sampleSources } from './sample'

  /** A card on the grid. */
  export type ConfigurableDashboardCardId =
    'requests' | 'regions' | 'transfer' | 'errors' | 'sources' | 'latency'

  /** A card that draws series. */
  export type ConfigurableDashboardChartId = Exclude<ConfigurableDashboardCardId, 'sources'>

  /** The series of each chart card, by card; a card left out shows its empty state. */
  export type ConfigurableDashboardSeries = Partial<
    Record<ConfigurableDashboardChartId, ChartSeries[]>
  >

  export interface ConfigurableDashboardProps {
    /** The interval labels of the time charts. Left out, the sample renders. */
    labels?: string[]
    /** The series of each chart card. Left out, the sample renders. */
    series?: ConfigurableDashboardSeries
    /** The services ranked in Top sources. Left out, the sample renders. */
    sources?: BarListItem[]
    /** The period is loading: every card shows its skeleton. */
    loading?: boolean
    /** Why the period could not load, after the name of each card in its danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<ConfigurableDashboardProps>(), {
    labels: undefined,
    series: undefined,
    sources: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  type CardVariant = 'area' | 'donut' | 'line' | 'bar' | 'bar-list'
  type CardFormat = 'count' | 'bytes' | 'ms'

  interface DashboardCard {
    title: string
    hint: string
    kind: CardVariant
    format: CardFormat
  }

  const cards: Record<ConfigurableDashboardCardId, DashboardCard> = {
    requests: {
      title: 'Requests over time',
      hint: 'Requests served by every service, per interval.',
      kind: 'area',
      format: 'count'
    },
    regions: {
      title: 'Requests by region',
      hint: 'Share of requests by the region that served them.',
      kind: 'donut',
      format: 'count'
    },
    transfer: {
      title: 'Data transferred',
      hint: 'Data delivered to clients and received from them, per interval.',
      kind: 'line',
      format: 'bytes'
    },
    errors: {
      title: 'Errors by status',
      hint: 'Requests that ended in a client or server error, per interval.',
      kind: 'bar',
      format: 'count'
    },
    sources: {
      title: 'Top sources',
      hint: 'The services that received the most requests in the period.',
      kind: 'bar-list',
      format: 'count'
    },
    latency: {
      title: 'Response time',
      hint: 'Time to the first byte at the 95th percentile, per interval.',
      kind: 'line',
      format: 'ms'
    }
  }

  const defaultSpans: Record<ConfigurableDashboardCardId, number> = {
    requests: 8,
    regions: 4,
    transfer: 6,
    errors: 6,
    sources: 4,
    latency: 8
  }

  const defaultLayout: DashboardGridLayoutItem[] = Object.entries(defaultSpans).map(
    ([id, span]) => ({ id, span })
  )

  const layoutModel = defineModel<DashboardGridLayoutItem[]>('layout')
  const editing = defineModel<boolean>('editing', { default: false })

  const layout = computed<DashboardGridLayoutItem[]>({
    get: () => layoutModel.value ?? defaultLayout.map((card) => ({ ...card })),
    set: (next) => {
      layoutModel.value = next
    }
  })

  const blocked = computed(() => props.loading || props.error !== '')
  const labels = computed(() => props.labels ?? (blocked.value ? [] : sampleLabels))
  const chartSeries = computed(() => props.series ?? (blocked.value ? {} : sampleSeries))
  const sources = computed(() => props.sources ?? (blocked.value ? [] : sampleSources))
  const cardOf = (id: string) => cards[id as ConfigurableDashboardCardId]
  const seriesOf = (id: string) => chartSeries.value[id as ConfigurableDashboardChartId] ?? []

  const { formatNumber } = useLocale()
  const fixed = (value: number, digits: number) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const formatters: Record<CardFormat, (value: number) => string> = {
    count: (value) => formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 }),
    bytes: (value) => {
      const steps = ['B', 'KB', 'MB', 'GB', 'TB']
      let current = value
      let index = 0
      while (current >= 1000 && index < steps.length - 1) {
        current /= 1000
        index += 1
      }
      return `${fixed(current, current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
    },
    ms: (value) => `${Math.round(value)} ms`
  }

  const activeIndex = ref<number | null>(null)
  const announcement = ref('')

  const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(defaultLayout))

  const reset = () => {
    layout.value = defaultLayout.map((card) => ({ ...card }))
    announcement.value = 'Layout reset to the default.'
  }

  const moveCard = (id: string, step: -1 | 1) => {
    const from = layout.value.findIndex((card) => card.id === id)
    const to = from + step
    if (from < 0 || to < 0 || to >= layout.value.length) return
    const next = [...layout.value]
    ;[next[from], next[to]] = [next[to]!, next[from]!]
    layout.value = next
    announcement.value = `${cardOf(id).title} moved to position ${to + 1} of ${next.length}.`
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Traffic overview"
        description="Requests, regions, errors and response time for the period, in the layout you set."
      />
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load the traffic overview. ${error}`"
        action-label="Retry"
        data-testid="dashboard-configurable__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <p
          v-if="editing"
          class="m-0 min-w-0 grow text-body-sm text-(--text-muted)"
        >
          Drag a card by its handle to move it, or by its corner to resize it. Focus a handle to use
          the arrow keys. On a narrow screen, use Move up and Move down.
        </p>
        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
          <Button
            v-if="customized"
            label="Reset layout"
            variant="ghost"
            size="medium"
            icon="az az-replay"
            @click="reset"
          />
          <Button
            :label="editing ? 'Done' : 'Edit layout'"
            :variant="editing ? 'primary' : 'outline'"
            size="medium"
            :icon="editing ? 'az az-check' : 'az az-layout-grid'"
            :aria-pressed="editing"
            @click="editing = !editing"
          />
        </div>
      </div>

      <DashboardGrid
        v-model:layout="layout"
        :editing="editing"
        aria-label="Traffic overview cards"
        :min-span="3"
        :max-span="12"
        :min-height="280"
        :max-height="720"
      >
        <DashboardGrid.Item
          v-for="(card, index) in layout"
          :key="card.id"
          :item-id="card.id"
          :label="cardOf(card.id).title"
        >
          <ChartCard>
            <ChartCard.Header>
              <span class="contents @max-3xl/dashboard-grid:hidden">
                <ChartCard.DragHandle :aria-label="'Move ' + cardOf(card.id).title" />
              </span>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>{{ cardOf(card.id).title }}</ChartCard.Title>
                <Hint :content="cardOf(card.id).hint" />
              </span>
              <ChartCard.Action v-if="editing">
                <span class="contents @max-3xl/dashboard-grid:hidden">
                  <Tag
                    :label="card.span + '/12'"
                    severity="neutral"
                    size="small"
                    icon="az az-move-horizontal"
                  />
                </span>
                <span class="flex items-center gap-(--spacing-2xs) @3xl/dashboard-grid:hidden">
                  <IconButton
                    icon="az az-arrow-up"
                    variant="ghost"
                    size="medium"
                    :aria-label="'Move ' + cardOf(card.id).title + ' up'"
                    :disabled="index === 0"
                    @click="moveCard(card.id, -1)"
                  />
                  <IconButton
                    icon="az az-arrow-down"
                    variant="ghost"
                    size="medium"
                    :aria-label="'Move ' + cardOf(card.id).title + ' down'"
                    :disabled="index === layout.length - 1"
                    @click="moveCard(card.id, 1)"
                  />
                </span>
              </ChartCard.Action>
            </ChartCard.Header>
            <ChartCard.Content>
              <p
                v-if="error"
                class="text-body-sm text-(--text-muted)"
              >
                Not available.
              </p>
              <DonutChart
                v-else-if="cardOf(card.id).kind === 'donut'"
                :series="seriesOf(card.id)"
                :format-value="formatters[cardOf(card.id).format]"
                empty-title="No requests yet"
                empty-description="Metrics appear here once a service serves requests."
                :loading="loading"
                :aria-label="cardOf(card.id).title"
              />
              <BarList
                v-else-if="cardOf(card.id).kind === 'bar-list'"
                :items="sources"
                sort="descending"
                :format-value="formatters[cardOf(card.id).format]"
                empty-title="No requests yet"
                :loading="loading"
                :aria-label="cardOf(card.id).title"
              />
              <Chart
                v-else
                v-model:active-index="activeIndex"
                :series="seriesOf(card.id)"
                :labels="labels"
                :format-value="formatters[cardOf(card.id).format]"
                empty-title="No requests yet"
                empty-description="Metrics appear here once a service serves requests."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis type="x" />
                <Chart.Bar
                  v-if="cardOf(card.id).kind === 'bar'"
                  stacked
                />
                <Chart.Area v-else-if="cardOf(card.id).kind === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend
                  v-if="seriesOf(card.id).length > 1"
                  total
                />
              </Chart>
            </ChartCard.Content>
            <ChartCard.ResizeHandle :aria-label="'Resize ' + cardOf(card.id).title" />
          </ChartCard>
        </DashboardGrid.Item>
      </DashboardGrid>

      <p
        class="sr-only"
        aria-live="polite"
      >
        {{ announcement }}
      </p>
    </div>
  </div>
</template>
