<script setup lang="ts">
  export interface SummaryFactsProps {
    /** The grid columns from sm up. */
    columns?: string
  }

  withDefaults(defineProps<SummaryFactsProps>(), {
    columns: 'sm:grid-cols-3 lg:grid-cols-6'
  })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <div
    class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-1 gap-(--spacing-sm)"
    :class="columns"
  >
    <slot />
  </div>
</template>
