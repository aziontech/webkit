<script setup>
  import Chart from '@aziontech/webkit/chart'

  const labels = [4, 12, 18, 26, 31, 45, 52, 64, 70, 88, 96, 120]
  const series = [
    {
      id: 'origin',
      name: 'Origin response time',
      values: [42, 55, 61, 70, 74, 96, 104, 121, 130, 162, 171, 210]
    },
    {
      id: 'edge',
      name: 'Edge response time',
      values: [8, 9, 11, 12, 12, 15, 16, 18, 19, 23, 24, 29]
    }
  ]
  const formatLabel = (label) => `${label} KB`
  const formatValue = (value) => `${value} ms`
</script>

<template>
  <Chart
    :series="series"
    :labels="labels"
    label-scale="linear"
    :format-label="formatLabel"
    :format-value="formatValue"
    aria-label="Response time by object size"
  >
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Scatter />
    <Chart.Tooltip />
    <Chart.Legend />
  </Chart>
</template>
