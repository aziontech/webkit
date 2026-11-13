<script setup>
  import MapChart from '@aziontech/webkit/map-chart'

  const points = [
    { id: 'new-york', name: 'New York', lat: 40.71, lon: -74.01, value: 18400 },
    { id: 'miami', name: 'Miami', lat: 25.76, lon: -80.19, value: 9200 },
    { id: 'frankfurt', name: 'Frankfurt', lat: 50.11, lon: 8.68, value: 12600 },
    { id: 'mumbai', name: 'Mumbai', lat: 19.07, lon: 72.88, value: 6100 },
    { id: 'tokyo', name: 'Tokyo', lat: 35.68, lon: 139.69, value: 8300 },
    { id: 'sydney', name: 'Sydney', lat: -33.87, lon: 151.21, value: 2700 }
  ]
</script>

<template>
  <MapChart
    :points="points"
    aria-label="Requests by point of presence"
  />
</template>
