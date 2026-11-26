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
  <div class="flex flex-col gap-(--spacing-xl)">
    <DonutChart
      :series="series"
      size="small"
      aria-label="Small"
    />
    <DonutChart
      :series="series"
      size="medium"
      aria-label="Medium"
    />
    <DonutChart
      :series="series"
      size="large"
      aria-label="Large"
    />
  </div>
</template>
