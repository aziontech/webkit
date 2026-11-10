<script setup>
  import DonutChart from '@aziontech/webkit/donut-chart'

  const series = [
    {
      id: 'Brazil',
      name: 'Brazil',
      values: [48210]
    },
    {
      id: 'United States',
      name: 'United States',
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
  <div class="flex flex-wrap gap-(--spacing-xl)">
    <DonutChart
      :series="series"
      kind="donut"
      total-label="Blocked threats"
      aria-label="Donut"
    />
    <DonutChart
      :series="series"
      kind="pie"
      aria-label="Pie"
    />
  </div>
</template>
