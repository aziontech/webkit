<script setup>
  import Button from '@aziontech/webkit/button'
  import DonutChart from '@aziontech/webkit/donut-chart'

  const series = [
    {
      id: 'none',
      name: 'Blocked threats',
      values: [0]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-2">
    <DonutChart
      :series="series"
      aria-label="Top WAF threat requests by country"
      empty-title="No threats in this range"
      empty-description="Nothing was blocked in the last 24 hours."
    />
    <DonutChart
      :series="series"
      aria-label="Top WAF threat requests by country"
      empty-title="No threats match these filters"
      empty-description="Choose another country or widen the time range."
    >
      <template #empty-actions>
        <Button
          label="Clear filters"
          kind="outlined"
          size="small"
        />
      </template>
    </DonutChart>
  </div>
</template>
