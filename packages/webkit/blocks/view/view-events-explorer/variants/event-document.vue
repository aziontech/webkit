<script setup lang="ts">
  import { ref } from 'vue'

  import DocumentFieldSearch from '../parts/document-field-search.vue'
  import { sampleEvents } from '../sample'
  import ViewEventsExplorer, { type EventsExplorerFilters } from '../view-events-explorer.vue'

  const filters = ref<EventsExplorerFilters>({ period: ['24h'] })
  const exclusions = ref<EventsExplorerFilters>({ host: ['legacy.example.com'] })
  const selectedKey = ref(
    sampleEvents.find(
      (event) => event.level === 'Error' && !exclusions.value.host?.includes(String(event.host))
    )?.id ?? ''
  )
</script>

<template>
  <ViewEventsExplorer
    v-model:filters="filters"
    v-model:exclusions="exclusions"
    v-model:selected-key="selectedKey"
  >
    <template #document-fields="{ fields }">
      <DocumentFieldSearch
        v-model:filters="filters"
        v-model:exclusions="exclusions"
        :fields="fields"
        :selected-key="selectedKey"
      />
    </template>
  </ViewEventsExplorer>
</template>
