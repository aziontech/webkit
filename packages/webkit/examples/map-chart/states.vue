<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
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
        <div
          role="alert"
          class="w-full"
        >
          <EmptyState
            title="Could not load requests by country"
            description="The analytics service did not answer. Check your connection and try again."
            icon="az az-triangle-alert"
            size="small"
            bordered
          >
            <template #actions>
              <Button
                label="Try again"
                variant="secondary"
                size="small"
                icon="az az-refresh"
                @click="failed = false"
              />
            </template>
          </EmptyState>
        </div>
      </template>
    </MapChart>
    <MapChart
      :regions="regions"
      table-view
      aria-label="Requests by country, as a table"
    />
  </div>
</template>
