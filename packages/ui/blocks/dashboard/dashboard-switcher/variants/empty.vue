<script setup lang="ts">
  import DashboardSwitcher from '../dashboard-switcher.vue'
</script>

<template>
  <DashboardSwitcher :data="{ figures: {}, labels: [], series: [], breakdown: [] }" />
</template>
