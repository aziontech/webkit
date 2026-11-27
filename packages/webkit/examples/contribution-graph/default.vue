<script setup lang="ts">
  import ContributionGraph, {
    type ContributionGraphItem
  } from '@aziontech/webkit/contribution-graph'
  import { ref } from 'vue'

  const selectedDate = ref<string | null>(null)

  const items: ContributionGraphItem[] = Array.from({ length: 365 }, (_, index) => {
    const dt = new Date(Date.UTC(2026, 0, 1 + index))
    const date = dt.toISOString().slice(0, 10)
    const count = (index * 7 + (index % 5)) % 13 === 0 ? 0 : (index * 3) % 14
    return { date, count }
  })
</script>

<template>
  <ContributionGraph
    v-model:selected-date="selectedDate"
    :items="items"
    :year="2026"
    aria-label="Platform contributions in 2026"
  />
</template>
