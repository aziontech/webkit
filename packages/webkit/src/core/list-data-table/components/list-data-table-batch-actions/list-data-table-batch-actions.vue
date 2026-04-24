<script setup>
  import PrimeButton from 'primevue/button'

  defineOptions({ name: 'DataTableBatchActions' })

  defineProps({
    selectedCount: {
      type: Number,
      default: 0
    },
    actions: {
      type: Array,
      default: () => []
    }
  })
</script>

<template>
  <div
    v-if="selectedCount > 0"
    class="flex items-center gap-3 px-4 py-2 bg-[var(--surface-ground)] border border-[var(--surface-border)] rounded-md"
    data-testid="data-table-batch-actions"
  >
    <span class="text-sm text-color-secondary whitespace-nowrap">
      {{ selectedCount }} {{ selectedCount === 1 ? 'item' : 'items' }} selected
    </span>
    <div class="flex gap-2">
      <PrimeButton
        v-for="action in actions"
        :key="action.label"
        :label="action.label"
        :icon="action.icon"
        :severity="action.severity || 'secondary'"
        size="small"
        outlined
        @click="action.command"
        :data-testid="`data-table-batch-action-${action.label?.toLowerCase().replace(/\s+/g, '-')}`"
      />
    </div>
  </div>
</template>
