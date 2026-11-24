<script setup>
  import Alert from '@aziontech/webkit/alert'
  import MapChart from '@aziontech/webkit/map-chart'
  import { ref } from 'vue'

  const regions = [
    { id: 'BR', value: 48200 },
    { id: 'US', value: 31600 },
    { id: 'DE', value: 18900 }
  ]

  const failed = ref(true)
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
      :regions="failed ? [] : regions"
      :error="failed ? 'Could not load requests by country.' : ''"
      aria-label="Requests by country, failed"
    >
      <template #error>
        <Alert
          severity="danger"
          label="Could not load requests by country."
          action-label="Retry"
          @action="failed = false"
        />
      </template>
    </MapChart>
    <MapChart
      :regions="regions"
      table-view
      aria-label="Requests by country, as a table"
    />
  </div>
</template>
