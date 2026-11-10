<script setup>
  import ChartCard from '@aziontech/webkit/chart-card'
  import Chart from '@aziontech/webkit/chart'
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
      color: 'success',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      color: 'danger',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    },
    {
      id: 'threat',
      name: 'WAF requests threat',
      color: 'warning',
      values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <ChartCard>
      <ChartCard.Header>
        <ChartCard.Title>Padded</ChartCard.Title>
      </ChartCard.Header>
      <ChartCard.Content>
        <Chart
          :series="series"
          :labels="labels"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Line />
          <Chart.Crosshair />
          <Chart.Tooltip />
          <Chart.Legend totals />
        </Chart>
      </ChartCard.Content>
    </ChartCard>
    <ChartCard>
      <ChartCard.Header>
        <ChartCard.Title>Flush</ChartCard.Title>
      </ChartCard.Header>
      <ChartCard.Content flush>
        <Chart
          :series="series"
          :labels="labels"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Line />
          <Chart.Crosshair />
          <Chart.Tooltip />
          <Chart.Legend totals />
        </Chart>
      </ChartCard.Content>
    </ChartCard>
  </div>
</template>
