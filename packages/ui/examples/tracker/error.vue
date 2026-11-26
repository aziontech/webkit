<script setup>
  import Alert from '@aziontech/ui/alert'
  import Tracker from '@aziontech/ui/tracker'
  import { ref } from 'vue'

  const failed = ref(true)
  const items = Array.from({ length: 90 }, (_, index) => ({
    id: `day-${index + 1}`,
    severity: index === 61 ? 'warning' : 'success',
    label: `Day ${index + 1}: ${index === 61 ? 'degraded' : 'operational'}`
  }))
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Tracker
      :items="failed ? [] : items"
      aria-label="Application uptime, last 90 days"
      :error="failed ? 'Uptime could not be loaded.' : ''"
    >
      <template #error>
        <Alert
          severity="danger"
          label="Uptime could not be loaded."
          action-label="Try again"
          @action="failed = false"
        />
      </template>
    </Tracker>
  </div>
</template>
