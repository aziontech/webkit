<script setup lang="ts">
  import type { BarListItem } from '@aziontech/ui/bar-list'
  import Button from '@aziontech/ui/button'
  import Chart, { type ChartSeries } from '@aziontech/ui/chart'
  import ChartCard from '@aziontech/ui/chart-card'
  import FilterMenu, { type FilterMenuModel } from '@aziontech/ui/filter-menu'
  import Hint from '@aziontech/ui/hint'
  import IconButton from '@aziontech/ui/icon-button'
  import Input from '@aziontech/ui/input'
  import PageHeader from '@aziontech/ui/page-header'
  import Select from '@aziontech/ui/select'
  import StatTile from '@aziontech/ui/stat-tile'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, ref } from 'vue'

  import {
    sampleActorCategories,
    sampleActorDestinations,
    sampleActorFigures,
    sampleActorFilterFields,
    sampleActorOutcomes,
    sampleActorRows,
    sampleActors,
    sampleActorTimeRanges
  } from '../sample'
  import ActorBarCard from './actor-bar-card.vue'
  import ActorRequestsCard from './actor-requests-card.vue'

  const emit = defineEmits<{ refresh: [event: MouseEvent] }>()

  const comparison = 'vs prior day'
  const timeRange = ref('Last 24 hours')
  const filters = ref<FilterMenuModel>({})
  const destination = ref('')
  const activeIndex = ref<number | null>(null)

  const labels = Array.from(
    { length: 24 },
    (_, index) => new Date(Date.UTC(2026, 10, 9, 15 + index))
  )

  const { formatNumber } = useLocale()
  const formatCount = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const picked = (id: string) => (filters.value[id] ?? []).map(String)
  const keeps = (id: string, value: string) => {
    const values = picked(id)
    return !values.length || values.includes(value)
  }
  const host = computed(() => destination.value.trim().toLowerCase())

  const filtering = computed(
    () => Object.values(filters.value).some((values) => values.length > 0) || host.value !== ''
  )

  const filteredRows = computed(() =>
    sampleActorRows.filter(
      (row) =>
        keeps('actor', row.actor) &&
        keeps('outcome', row.outcome) &&
        keeps('category', row.category) &&
        (!host.value || row.destination.toLowerCase().includes(host.value))
    )
  )

  const share = computed(() =>
    sampleActorRows.length ? filteredRows.value.length / sampleActorRows.length : 0
  )
  const outcomeIds: ReadonlySet<string> = new Set([
    'allowed',
    'blocked',
    'held',
    'approved',
    'denied'
  ])

  const visibleFigures = computed(() =>
    filtering.value
      ? sampleActorFigures.map((figure) => {
          if (!filteredRows.value.length) return { ...figure, value: null, delta: null }
          const excluded = outcomeIds.has(figure.id) && !keeps('outcome', figure.id)
          return {
            ...figure,
            value: excluded ? 0 : Math.round(figure.value * share.value),
            delta: null
          }
        })
      : sampleActorFigures
  )

  const scaled = (entry: ChartSeries): ChartSeries => ({
    ...entry,
    values: entry.values.map((value) => (value === null ? null : Math.round(value * share.value)))
  })

  const visibleOutcomes = computed<ChartSeries[]>(() => {
    if (!filtering.value) return sampleActorOutcomes
    if (!filteredRows.value.length) return []
    return sampleActorOutcomes.filter((entry) => keeps('outcome', entry.id)).map(scaled)
  })

  const narrow = (items: BarListItem[], keep: (item: BarListItem) => boolean) =>
    filtering.value ? (filteredRows.value.length ? items.filter(keep) : []) : items

  const visibleActors = computed(() =>
    narrow(sampleActors, (item) => keeps('actor', String(item.id ?? item.name)))
  )
  const visibleCategories = computed(() =>
    narrow(sampleActorCategories, (item) => keeps('category', String(item.id ?? item.name)))
  )
  const visibleDestinations = computed(() =>
    narrow(
      sampleActorDestinations,
      (item) => !host.value || item.name.toLowerCase().includes(host.value)
    )
  )

  const emptyTitle = computed(() =>
    filtering.value ? 'No requests match these filters' : 'No requests in this time range'
  )
  const emptyDescription = computed(() =>
    filtering.value
      ? 'Clear the filters or pick other values.'
      : 'Requests the rules evaluate appear here. Widen the time range to see older ones.'
  )

  const clearFilters = () => {
    filters.value = {}
    destination.value = ''
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Request activity"
        description="What each actor requested through the rules: what was allowed, blocked or held for approval, and what went over budget, per actor, category and destination."
      >
        <template #actions>
          <div class="w-full sm:w-44">
            <Select
              variant="ghost"
              v-model="timeRange"
              size="medium"
            >
              <Select.Trigger aria-label="Time range" />
              <Select.Content>
                <Select.Item
                  v-for="option in sampleActorTimeRanges"
                  :key="String(option.value)"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
          <IconButton
            icon="az az-refresh"
            variant="outline"
            size="medium"
            aria-label="Refresh"
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </template>
      </PageHeader>

      <section
        aria-label="Filters"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
          <FilterMenu
            v-model="filters"
            :fields="sampleActorFilterFields"
            size="medium"
          />
          <div class="w-full min-w-0 sm:w-(--container-3xs)">
            <Input
              v-model="destination"
              placeholder="Filter by host"
              size="medium"
              aria-label="Destination host"
            >
              <template #leading>
                <span
                  class="text-body-sm text-(--text-muted)"
                  aria-hidden="true"
                  >Destination</span
                >
              </template>
            </Input>
          </div>
        </div>
        <FilterMenu.ChipGroup
          v-model="filters"
          :fields="sampleActorFilterFields"
        />
      </section>

      <section aria-label="Outcomes">
        <ul class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-4 2xl:grid-cols-7">
          <li
            v-for="figure in visibleFigures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="figure.value"
              :format-value="formatCount"
              :delta="figure.delta"
              :delta-label="comparison"
              :inverse="figure.inverse"
            >
              <template #aside>
                <Hint :content="figure.description" />
              </template>
            </StatTile>
          </li>
        </ul>
      </section>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 flex-1 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Outcomes over time</ChartCard.Title>
              <Hint content="Requests per hour, stacked by the outcome the rules gave them." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="visibleOutcomes"
              :labels="labels"
              :format-value="formatCount"
              :empty-title="emptyTitle"
              :empty-description="emptyDescription"
            >
              <template
                v-if="filtering"
                #empty-actions
              >
                <Button
                  label="Clear filters"
                  variant="outline"
                  size="small"
                  @click="clearFilters"
                />
              </template>
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar stacked />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ActorBarCard
          title="Actors"
          hint="Requests per actor, every outcome included."
          :items="visibleActors"
          :format-value="formatCount"
          :empty-title="emptyTitle"
          list-label="Requests by actor"
        />
        <ActorBarCard
          title="Categories"
          hint="Requests per category of action, every outcome included."
          :items="visibleCategories"
          :format-value="formatCount"
          :color="2"
          :empty-title="emptyTitle"
          list-label="Requests by category"
        />
        <ActorBarCard
          title="Destinations"
          hint="Requests per destination host, every outcome included."
          :items="visibleDestinations"
          :format-value="formatCount"
          :color="3"
          :empty-title="emptyTitle"
          list-label="Requests by destination"
        />

        <ActorRequestsCard
          :rows="filteredRows"
          :filtering="filtering"
          @clear="clearFilters"
        />
      </div>
    </div>
  </div>
</template>
