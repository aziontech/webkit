<script setup lang="ts">
  import AlertsDashboard from '../alerts-dashboard.vue'
</script>

<template>
  <AlertsDashboard
    :kpis="{}"
    :labels="[]"
    :series="[]"
    :open-by-level="[]"
    :types="[]"
    :entities="[]"
    :alerts="[]"
  />
</template>
