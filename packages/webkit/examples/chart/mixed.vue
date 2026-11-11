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
      id: 'requests',
      name: 'Requests',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'cached',
      name: 'Served from cache',
      values: [880, 1010, 960, 1150, 1190, 1120, 1290, 1250, 1400, 1370, 1490, 1450]
    }
  ]
</script>

<template>
  <Chart
    :series="series"
    :labels="labels"
    aria-label="Requests and cache hits"
  >
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Axis kind="x" />
    <Chart.Bar :ids="['requests']" />
    <Chart.Line :ids="['cached']" />
    <Chart.Crosshair />
    <Chart.Tooltip />
    <Chart.Legend totals />
  </Chart>
</template>
