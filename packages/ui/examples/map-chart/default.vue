<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const regions = [
    { id: 'BR', value: 48200 },
    { id: 'US', value: 31600 },
    { id: 'DE', value: 18900 },
    { id: 'IN', value: 15400 },
    { id: 'JP', value: 9800 },
    { id: 'MX', value: 7600 },
    { id: 'ZA', value: 4100 },
    { id: 'AU', value: 3900 }
  ]
</script>

<template>
  <MapChart
    :regions="regions"
    aria-label="Requests by country"
  />
</template>
