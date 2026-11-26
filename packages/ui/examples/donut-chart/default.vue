<script setup>
  import DonutChart from '@aziontech/webkit/donut-chart'

  const series = [
    {
      id: 'United States',
      name: 'United States',
      values: [48210]
    },
    {
      id: 'United Kingdom',
      name: 'United Kingdom',
      values: [31620]
    },
    {
      id: 'Germany',
      name: 'Germany',
      values: [18930]
    },
    {
      id: 'India',
      name: 'India',
      values: [12480]
    },
    {
      id: 'Netherlands',
      name: 'Netherlands',
      values: [9370]
    },
    {
      id: 'Singapore',
      name: 'Singapore',
      values: [6120]
    }
  ]
</script>

<template>
  <DonutChart
    :series="series"
    total-label="Blocked threats"
    aria-label="Top WAF threat requests by country"
  />
</template>
