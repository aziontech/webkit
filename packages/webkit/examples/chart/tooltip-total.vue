<script setup>
  import Chart from '@aziontech/webkit/chart'
  import { computed, ref } from 'vue'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = [
    {
      id: 'error',
      name: 'Error',
      color: 'severity-critical',
      values: [4, 6, 3, 12, 18, 9, 5, 4, 7, 3, 2, 5]
    },
    {
      id: 'warning',
      name: 'Warning',
      color: 'severity-medium',
      values: [20, 24, 18, 31, 40, 28, 22, 19, 25, 17, 16, 21]
    },
    {
      id: 'info',
      name: 'Info',
      color: 'severity-low',
      values: [210, 240, 220, 260, 280, 250, 230, 225, 245, 215, 205, 235]
    },
    {
      id: 'debug',
      name: 'Debug',
      color: 'severity-info',
      values: [60, 72, 58, 80, 95, 70, 64, 61, 69, 55, 52, 66]
    }
  ]
  const range = ref(null)
  const selected = computed(() =>
    range.value
      ? `Showing events from ${labels[range.value[0]]} to ${labels[range.value[1]]}.`
      : 'Showing every event in the last hour.'
  )
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <Chart
      v-model:range="range"
      :series="series"
      :labels="labels"
      :height="80"
      aria-label="Event volume by level. Use the arrow keys to read each bucket and Enter to filter the log to it."
    >
      <Chart.Axis
        type="x"
        :ticks="3"
      />
      <Chart.Brush />
      <Chart.Bar
        type="histogram"
        stacked
      />
      <Chart.Crosshair />
      <Chart.Tooltip total>
        <template #footer>Click to filter to this bucket, or drag to select a span.</template>
      </Chart.Tooltip>
    </Chart>
    <p class="text-body-sm text-(--text-muted)">{{ selected }}</p>
  </div>
</template>
