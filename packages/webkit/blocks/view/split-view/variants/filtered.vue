<script setup lang="ts">
  import { ref } from 'vue'

  import SplitView, { type SplitViewFilters } from '../split-view.vue'

  const filters = ref<SplitViewFilters>({
    period: ['24h'],
    source: ['security', 'access'],
    level: ['Error']
  })
</script>

<template>
  <SplitView v-model:filters="filters" />
</template>
