<script setup lang="ts">
  import Hint from '@aziontech/webkit/hint'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { computed, ref } from 'vue'

  import { usageFigures, usageReports } from '../../lib/data/dashboards/usage'
  import MetricReportCard from '../observability/MetricReportCard.vue'

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

  const activeIndex = ref<number | null>(null)

  const figures = computed(() => usageFigures(props.period, { empty: props.empty }))
  const reports = computed(() => usageReports(props.period, { empty: props.empty }))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-3">
      <li
        v-for="figure in figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="empty ? null : figure.value"
          :format-value="figure.format"
          :delta="empty ? null : figure.delta"
          :delta-label="comparison"
          :inverse="figure.variation === 'inverse'"
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
      <MetricReportCard
        v-for="report in reports"
        :key="report.id"
        v-model:active-index="activeIndex"
        :report="report"
        :empty="empty"
        :loading="loading"
        :refetching="refetching"
      />
    </div>
  </div>
</template>
