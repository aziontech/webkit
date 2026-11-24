<script setup lang="ts">
  import { useInvestigationSessions } from '../composables/use-investigation-sessions'
  import { useSimulatedRefresh } from '../composables/use-simulated-refresh'
  import InvestigationTabs from '../parts/investigation-tabs.vue'
  import { sampleEvents } from '../sample'
  import ViewEventsExplorer from '../view-events-explorer.vue'

  const investigations = useInvestigationSessions()
  const { activeSession, filters, search } = investigations
  const { loading, refresh } = useSimulatedRefresh()
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <InvestigationTabs
      v-model:active="activeSession"
      :sessions="investigations.sessions.value"
      :current-name="investigations.currentSession.value.name"
      :notice="investigations.notice.value"
      @create="investigations.create"
      @duplicate="investigations.duplicate"
      @close="investigations.close"
      @rename="investigations.rename"
    />
    <ViewEventsExplorer
      :key="activeSession"
      v-model:filters="filters"
      v-model:search="search"
      :events="sampleEvents"
      :loading="loading"
      class="min-h-0 flex-1"
      @refresh="refresh"
    />
  </div>
</template>
