<script setup lang="ts">
  import { ref } from 'vue'

  import { useEventQuery } from '../composables/use-event-query'
  import { useEventQueryRange } from '../composables/use-event-query-range'
  import { useSavedQueries } from '../composables/use-saved-queries'
  import { useSimulatedRefresh } from '../composables/use-simulated-refresh'
  import QueryToolbar from '../parts/query-toolbar.vue'
  import { sampleEvents } from '../sample'
  import ViewEventsExplorer from '../view-events-explorer.vue'

  const timeZone = ref('UTC')
  const refreshInterval = ref(300)
  const timeRange = useEventQueryRange()
  const eventQuery = useEventQuery(timeRange)
  const savedQueries = useSavedQueries(eventQuery)
  const { filters, page, matchesAppliedQuery } = eventQuery
  const { loading, refresh } = useSimulatedRefresh()
</script>

<template>
  <ViewEventsExplorer
    v-model:filters="filters"
    v-model:page="page"
    :events="sampleEvents"
    :match="matchesAppliedQuery"
    :time-zone="timeZone"
    :loading="loading"
  >
    <template #toolbar="{ exportCsv, exportDisabled }">
      <QueryToolbar
        v-model:time-zone="timeZone"
        v-model:refresh-interval="refreshInterval"
        :time-range="timeRange"
        :event-query="eventQuery"
        :saved-queries="savedQueries"
        :loading="loading"
        :export-disabled="exportDisabled"
        @refresh="refresh"
        @export="exportCsv"
      />
    </template>
  </ViewEventsExplorer>
</template>
