<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'

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
      id: 'allowed',
      name: 'WAF requests allowed',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    },
    {
      id: 'threat',
      name: 'WAF requests threat',
      values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
    }
  ]
</script>

<template>
  <ChartCard>
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>Threats vs requests</ChartCard.Title>
        <Hint content="Requests WAF analyzed, split into blocked, logged and allowed." />
      </span>
    </ChartCard.Header>
    <ChartCard.Content>
      <Chart
        :series="series"
        :labels="labels"
      >
        <Chart.Grid />
        <Chart.Axis type="y" />
        <Chart.Axis type="x" />
        <Chart.Line />
        <Chart.Crosshair />
        <Chart.Tooltip />
        <Chart.Legend total />
      </Chart>
    </ChartCard.Content>
    <ChartCard.Footer>Last hour, 5 minute buckets</ChartCard.Footer>
  </ChartCard>
</template>
