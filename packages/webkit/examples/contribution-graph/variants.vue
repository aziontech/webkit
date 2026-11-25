<script setup lang="ts">
  import ContributionGraph, {
    type ContributionGraphItem
  } from '@aziontech/webkit/contribution-graph'

  const items: ContributionGraphItem[] = Array.from({ length: 365 }, (_, index) => {
    const dt = new Date(Date.UTC(2026, 0, 1 + index))
    const date = dt.toISOString().slice(0, 10)
    const count = (index * 5) % 11 === 0 ? 0 : (index * 2) % 12
    return { date, count }
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <ContributionGraph
      :items="items"
      :year="2026"
      variant="square"
      aria-label="Square contribution graph"
    />
    <ContributionGraph
      :items="items"
      :year="2026"
      variant="dot"
      aria-label="Dot contribution graph"
    />
  </div>
</template>
