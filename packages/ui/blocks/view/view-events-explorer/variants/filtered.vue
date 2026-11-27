<script setup lang="ts">
  import { ref } from 'vue'

  import ViewEventsExplorer, { type EventsExplorerFilters } from '../view-events-explorer.vue'

  const filters = ref<EventsExplorerFilters>({
    period: ['24h'],
    source: ['security', 'access'],
    level: ['Error']
  })
</script>

<template>
  <ViewEventsExplorer v-model:filters="filters" />
</template>
