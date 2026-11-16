<script setup lang="ts">
  import BreakdownDashboard from '../breakdown-dashboard.vue'
</script>

<template>
  <BreakdownDashboard
    :kpis="{}"
    :labels="[]"
    :series="[]"
    :split="[]"
    :contributors="[]"
  />
</template>
