<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const regions = [
    { id: 'BR', value: 48200 },
    { id: 'US', value: 31600 },
    { id: 'DE', value: 18900 }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <MapChart
      loading
      aria-label="Requests by country, loading"
    />
    <MapChart
      aria-label="Requests by country, empty"
      empty-description="No request matched the filters in this range."
    />
    <MapChart
      error="Could not load requests by country. Try again in a few seconds."
      aria-label="Requests by country, failed"
    />
    <MapChart
      :regions="regions"
      table-view
      aria-label="Requests by country, as a table"
    />
  </div>
</template>
