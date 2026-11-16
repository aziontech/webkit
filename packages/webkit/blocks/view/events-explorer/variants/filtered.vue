<script setup lang="ts">
  import { ref } from 'vue'

  import EventsExplorer, { type EventsExplorerFilters } from '../events-explorer.vue'

  const filters = ref<EventsExplorerFilters>({
    period: ['24h'],
    source: ['security', 'access'],
    level: ['Error']
  })
</script>

<template>
  <EventsExplorer v-model:filters="filters" />
</template>
