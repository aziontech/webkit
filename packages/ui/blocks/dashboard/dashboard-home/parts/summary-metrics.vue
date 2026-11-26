<script setup lang="ts">
  import Hint from '@aziontech/ui/hint'
  import StatTile from '@aziontech/ui/stat-tile'

  import { homeMetricDefinitions } from '../home-metrics'
  import { sampleMetrics, sampleSummaryRange } from '../sample'

  const metrics = homeMetricDefinitions.map((definition) => ({
    ...definition,
    value: sampleMetrics[definition.id]?.value ?? null
  }))
  const metricsRange = sampleSummaryRange
</script>

<template>
  <section
    aria-labelledby="summary-metrics"
    class="flex min-w-0 flex-col gap-(--layout-group-gap)"
  >
    <div class="flex items-center gap-(--spacing-xs)">
      <h2
        id="summary-metrics"
        class="text-title-sm text-(--text-default)"
      >
        Metrics
      </h2>
      <Hint content="Traffic across every resource in the last hour, refreshed each minute." />
    </div>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
      <li
        v-for="metric in metrics"
        :key="metric.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="metric.label"
          :value="metric.value"
          :unit="metric.unit"
        >
          <template #aside>
            <Hint :content="metric.hint" />
          </template>
        </StatTile>
      </li>
    </ul>

    <p class="text-end text-body-2xs text-pretty text-(--text-muted)">
      {{ metricsRange }}
    </p>
  </section>
</template>
