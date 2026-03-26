<template>
  <div
    class="flex items-center justify-between px-4 py-3 border-t border-[var(--surface-border)] bg-[var(--surface-ground)]"
    data-testid="data-table-review-changes"
  >
    <div class="flex items-center gap-2">
      <span class="text-sm text-color-secondary">Changes pending</span>
      <Badge
        :value="alteredCount"
        severity="warning"
      />
    </div>
    <div class="flex gap-2">
      <PrimeButton
        label="Discard"
        outlined
        size="small"
        @click="emit('discard')"
        data-testid="data-table-review-changes-discard"
      />
      <PrimeButton
        label="Review"
        severity="secondary"
        size="small"
        @click="emit('review')"
        data-testid="data-table-review-changes-review"
      />
    </div>
  </div>
</template>

<script setup>
  import PrimeButton from 'primevue/button'
  import Badge from 'primevue/badge'

  defineOptions({ name: 'DataTableReviewChanges' })

  defineProps({
    alteredCount: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['discard', 'review'])
</script>
