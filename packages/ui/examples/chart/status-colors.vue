<script setup>
  import Chart from '@aziontech/ui/chart'

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
  const requests = [
    {
      id: 'allowed',
      name: 'WAF requests allowed',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      color: 'danger',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    }
  ]
  const levels = [
    {
      id: 'critical',
      name: 'Critical',
      color: 'severity-critical',
      values: [4, 6, 3, 12, 18, 9, 5, 4, 7, 3, 2, 5]
    },
    {
      id: 'high',
      name: 'High',
      color: 'severity-high',
      values: [12, 15, 10, 22, 27, 19, 14, 12, 16, 11, 9, 13]
    },
    {
      id: 'medium',
      name: 'Medium',
      color: 'severity-medium',
      values: [20, 24, 18, 31, 40, 28, 22, 19, 25, 17, 16, 21]
    },
    {
      id: 'low',
      name: 'Low',
      color: 'severity-low',
      values: [34, 38, 30, 45, 52, 41, 36, 33, 39, 31, 29, 35]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <Chart
      :series="requests"
      :labels="labels"
      aria-label="Allowed and blocked requests"
    >
      <Chart.Grid />
      <Chart.Axis type="y" />
      <Chart.Axis
        type="x"
        :ticks="4"
      />
      <Chart.Line />
      <Chart.Crosshair />
      <Chart.Tooltip />
      <Chart.Legend />
    </Chart>
    <Chart
      :series="levels"
      :labels="labels"
      aria-label="Findings by severity"
    >
      <Chart.Grid />
      <Chart.Axis type="y" />
      <Chart.Axis
        type="x"
        :ticks="4"
      />
      <Chart.Bar stacked />
      <Chart.Crosshair />
      <Chart.Tooltip />
      <Chart.Legend />
    </Chart>
  </div>
</template>
