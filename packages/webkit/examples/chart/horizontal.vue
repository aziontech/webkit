<script setup>
  import Chart from '@aziontech/webkit/chart'

  const countries = [
    'Brazil',
    'United States',
    'Germany',
    'India',
    'Netherlands',
    'Singapore',
    'France',
    'Japan'
  ]
  const series = [
    {
      id: 'blocked',
      name: 'Blocked threats',
      values: [48210, 31620, 18930, 12480, 9370, 6120, 4410, 2980]
    }
  ]
</script>

<template>
  <Chart
    :series="series"
    :labels="countries"
    orientation="horizontal"
    aria-label="Top WAF threat requests by country"
  >
    <Chart.Grid />
    <Chart.Axis kind="y" />
    <Chart.Bar labeled />
    <Chart.Tooltip />
  </Chart>
</template>
