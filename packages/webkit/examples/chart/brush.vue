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
      color: 'danger',
      values: [4, 6, 3, 12, 18, 9, 5, 4, 7, 3, 2, 5]
    },
    {
      id: 'warning',
      name: 'Warning',
      color: 'warning',
      values: [20, 24, 18, 31, 40, 28, 22, 19, 25, 17, 16, 21]
    },
    {
      id: 'info',
      name: 'Info',
      color: 'info',
      values: [210, 240, 220, 260, 280, 250, 230, 225, 245, 215, 205, 235]
    }
  ]
  const range = ref(null)
  const selected = computed(() =>
    range.value
      ? `Showing events from ${labels[range.value[0]]} to ${labels[range.value[1]]}.`
      : 'Drag across the chart, or hold Shift with the arrow keys, to filter the log to a span.'
  )
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <Chart
      v-model:range="range"
      :series="series"
      :labels="labels"
      :height="120"
      aria-label="Event volume by level"
    >
      <Chart.Axis kind="x" />
      <Chart.Brush />
      <Chart.Bar stacked />
      <Chart.Tooltip />
    </Chart>
    <p class="text-body-sm text-(--text-muted)">{{ selected }}</p>
  </div>
</template>
