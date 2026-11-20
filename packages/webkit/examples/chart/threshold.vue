<script setup>
  import Chart from '@aziontech/webkit/chart'

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
      id: 'p95',
      name: 'p95 latency',
      values: [212, 236, 248, 231, 264, 302, 341, 318, 287, 255, 242, 228]
    }
  ]
  const formatMs = (value) => `${value} ms`
</script>

<template>
  <Chart
    :series="series"
    :labels="labels"
    :format-value="formatMs"
    aria-label="p95 latency against the SLO"
  >
    <Chart.Grid />
    <Chart.Axis type="y" />
    <Chart.Axis type="x" />
    <Chart.Reference
      :from="200"
      :to="260"
      label="Normal range"
    />
    <Chart.Line
      :ids="['p95']"
      curve="monotone"
    />
    <Chart.Reference
      :value="400"
      label="SLO 400 ms"
      severity="danger"
    />
    <Chart.Crosshair />
    <Chart.Tooltip />
  </Chart>
</template>
