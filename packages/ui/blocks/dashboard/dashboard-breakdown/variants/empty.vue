<script setup lang="ts">
  import DashboardBreakdown from '../dashboard-breakdown.vue'
</script>

<template>
  <DashboardBreakdown
    :kpis="{
      total: { value: 0, delta: null, trend: [] },
      compute: { value: 0, delta: null, trend: [] },
      database: { value: 0, delta: null, trend: [] },
      storage: { value: 0, delta: null, trend: [] }
    }"
    :labels="[]"
    :series="[]"
    :split="[]"
    :contributors="[]"
  />
</template>
