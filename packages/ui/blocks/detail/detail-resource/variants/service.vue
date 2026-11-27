<script setup lang="ts">
  import ServiceSummaryCard from '../parts/service-summary-card.vue'

  const environment = defineModel<string>('environment', { default: 'Production' })
</script>

<template>
  <ServiceSummaryCard v-model:environment="environment" />
</template>
