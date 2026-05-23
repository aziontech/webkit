<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableBatchActions',
    inheritAttrs: false
  })

  export interface BatchAction {
    label: string
    icon?: string
    command: () => void
    severity?: string
  }

  withDefaults(
    defineProps<{
      /** Number of selected rows. */
      selectedCount?: number
      /** Bulk action buttons. */
      actions?: BatchAction[]
    }>(),
    {
      selectedCount: 0,
      actions: () => []
    }
  )

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__batch-actions`
  )
</script>

<template>
  <div
    v-if="selectedCount > 0"
    v-bind="attrs"
    class="flex items-center gap-[var(--spacing-3)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-canvas)] px-[var(--spacing-4)] py-[var(--spacing-2)]"
    :data-testid="testId"
  >
    <span class="whitespace-nowrap text-body-sm text-[var(--text-muted)]">
      {{ selectedCount }} {{ selectedCount === 1 ? 'item' : 'items' }} selected
    </span>
    <div class="flex gap-[var(--spacing-2)]">
      <Button
        v-for="action in actions"
        :key="action.label"
        :label="action.label"
        :icon="action.icon"
        kind="outlined"
        size="small"
        :data-testid="`${testId}__action-${action.label}`"
        @click="action.command"
      />
    </div>
  </div>
</template>
