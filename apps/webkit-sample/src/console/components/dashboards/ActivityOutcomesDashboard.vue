<script setup lang="ts">
  import BarList from '@aziontech/webkit/bar-list'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import Hint from '@aziontech/webkit/hint'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  import {
    ACTIVITY_COLUMNS,
    activityBreakdowns,
    activityFigures,
    activityLabels,
    activityLog,
    activityOutcomes,
    ACTOR_OPTIONS,
    ANY_ACTOR,
    ANY_CATEGORY,
    ANY_OUTCOME,
    CATEGORY_OPTIONS,
    formatCount,
    matchActivity,
    OUTCOME_OPTIONS,
    outcomeTag,
    severityTag
  } from '../../lib/data/dashboards/activity-outcomes'

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

  const actor = ref(ANY_ACTOR)
  const outcome = ref(ANY_OUTCOME)
  const category = ref(ANY_CATEGORY)
  const destination = ref('')
  const activeIndex = ref<number | null>(null)

  const blank = computed(() => props.loading || props.empty)

  const figures = computed(() => activityFigures(props.period, { blank: blank.value }))
  const labels = computed(() => activityLabels(props.period))
  const outcomes = computed(() => activityOutcomes(props.period, { empty: props.empty }))
  const breakdowns = computed(() => activityBreakdowns(props.period, { empty: props.empty }))
  const log = computed(() => activityLog({ blank: blank.value }))
  const rows = computed(() =>
    matchActivity(log.value, {
      actor: actor.value,
      outcome: outcome.value,
      category: category.value,
      destination: destination.value
    })
  )

  watch(
    () => props.period,
    () => {
      activeIndex.value = null
    }
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <section
      aria-label="Filters"
      class="grid grid-cols-1 items-start gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4"
    >
      <FieldSelect
        v-model="actor"
        input-id="activity-actor"
        label="Actor"
        size="medium"
        :options="ACTOR_OPTIONS"
      />
      <FieldSelect
        v-model="outcome"
        input-id="activity-outcome"
        label="Outcome"
        size="medium"
        :options="OUTCOME_OPTIONS"
      />
      <FieldSelect
        v-model="category"
        input-id="activity-category"
        label="Category"
        size="medium"
        :options="CATEGORY_OPTIONS"
      />
      <FieldText
        v-model="destination"
        input-id="activity-destination"
        label="Destination"
        placeholder="api.example.com"
        helper-text="Exact host."
        size="medium"
      />
    </section>

    <section aria-label="Outcomes">
      <ul class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-4 xl:grid-cols-7">
        <li
          v-for="figure in figures"
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
            :loading="loading"
          >
            <template #aside>
              <Hint :text="figure.description" />
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
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Outcomes over time</ChartCard.Title>
            <Hint text="Requests per interval, stacked by the outcome the rules gave them." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            v-model:active-index="activeIndex"
            :series="outcomes"
            :labels="labels"
            :format-value="formatCount"
            empty-title="No requests in this period"
            empty-description="Requests the rules evaluate appear here. Widen the period to see older ones."
            :loading="loading"
            :refetching="refetching"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Bar stacked />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend totals />
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Actors</ChartCard.Title>
            <Hint text="Requests per actor, every outcome included." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="breakdowns.actors"
            :format-value="formatCount"
            empty-title="No request in this period"
            :loading="loading"
            aria-label="Requests by actor"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Categories</ChartCard.Title>
            <Hint text="Requests per category of action, every outcome included." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="breakdowns.categories"
            :format-value="formatCount"
            :color="2"
            empty-title="No request in this period"
            :loading="loading"
            aria-label="Requests by category"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Destinations</ChartCard.Title>
            <Hint text="Requests per destination host, every outcome included." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="breakdowns.destinations"
            :format-value="formatCount"
            :color="3"
            empty-title="No request in this period"
            :loading="loading"
            aria-label="Requests by destination"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Requests</ChartCard.Title>
            <Hint text="The latest requests, newest first, with the rule that decided each one." />
          </span>
          <ChartCard.Controls>
            <Tag
              v-if="!loading && rows.length"
              :label="`${rows.length} requests`"
              severity="secondary"
              size="small"
            />
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <TableRoot
            v-if="loading || log.length"
            :data="rows"
            :columns="ACTIVITY_COLUMNS"
            row-key="id"
            enable-sorting
            paginated
            :page-size="10"
            :rows-per-page-options="[10, 25, 50]"
            header-kind="compact"
            border
            :loading="loading"
          >
            <template #empty>
              <EmptyState
                size="small"
                icon="pi pi-filter"
                title="No matching requests"
                description="Change the actor, outcome, category or destination."
              />
            </template>
            <template #cell-outcome="{ row }">
              <Tag
                :label="outcomeTag(row.outcome).label"
                :severity="outcomeTag(row.outcome).severity"
                size="small"
              />
            </template>
            <template #cell-severity="{ row }">
              <Tag
                :label="severityTag(row.severity).label"
                :severity="severityTag(row.severity).severity"
                size="small"
              />
            </template>
            <template #cell-method="{ row }">
              <span class="font-mono text-body-sm">{{ row.method }}</span>
            </template>
          </TableRoot>
          <EmptyState
            v-else
            size="small"
            icon="pi pi-list"
            title="No requests in this period"
            description="Requests the rules evaluate appear here. Widen the period to see older ones."
          />
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
