<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const regions = [
    { id: 'BR', value: 48200 },
    { id: 'AR', value: 9100 },
    { id: 'CO', value: 6800 },
    { id: 'CL', value: 5200 },
    { id: 'PE', value: 3100 }
  ]
  const points = [
    { id: 'sao-paulo', name: 'São Paulo', lat: -23.55, lon: -46.63, value: 18400, color: 2 },
    { id: 'buenos-aires', name: 'Buenos Aires', lat: -34.6, lon: -58.38, value: 4300, color: 2 }
  ]
</script>

<template>
  <MapChart
    :regions="regions"
    :points="points"
    view="south-america"
    aria-label="Requests in South America"
  />
</template>
