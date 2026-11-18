<script setup lang="ts">
  import DashboardBreakdown from '../dashboard-breakdown.vue'
</script>

<template>
  <DashboardBreakdown
    :kpis="{}"
    :labels="[]"
    :series="[]"
    :split="[]"
    :contributors="[]"
  />
</template>
