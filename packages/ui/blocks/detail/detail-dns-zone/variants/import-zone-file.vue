<script setup lang="ts">
  import { ref } from 'vue'

  import DetailDnsZone, { type DnsZoneDetailRecord } from '../detail-dns-zone.vue'
  import ImportZoneFileDrawer from '../parts/import-zone-file-drawer.vue'
  import { sampleRecords } from '../sample'

  const rows = ref<DnsZoneDetailRecord[]>([...sampleRecords])
  const importOpen = ref(true)
</script>

<template>
  <DetailDnsZone
    tab="records"
    importable
    :records="rows"
    @import="importOpen = true"
  />

  <ImportZoneFileDrawer
    v-model:open="importOpen"
    v-model:records="rows"
  />
</template>
