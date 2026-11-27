<script setup lang="ts">
  import SummaryActivity from '../parts/summary-activity.vue'
  import SummaryMarketplace from '../parts/summary-marketplace.vue'
  import SummaryMetrics from '../parts/summary-metrics.vue'
  import SummaryUsageCard from '../parts/summary-usage-card.vue'
  import SummaryZones from '../parts/summary-zones.vue'
</script>

<template>
  <div class="layout-boundary">
    <div
      class="layout-column flex min-w-0 flex-col gap-(--layout-section-gap) xl:flex-row xl:items-start"
    >
      <div class="flex min-w-0 flex-1 flex-col gap-(--layout-section-gap)">
        <SummaryMetrics />
        <SummaryZones />
        <SummaryActivity />
      </div>

      <aside
        aria-label="Usage and marketplace"
        class="flex w-full min-w-0 flex-col gap-(--layout-section-gap) xl:max-w-(--container-xs) xl:shrink-0"
      >
        <SummaryUsageCard />
        <SummaryMarketplace />
      </aside>
    </div>
  </div>
</template>
