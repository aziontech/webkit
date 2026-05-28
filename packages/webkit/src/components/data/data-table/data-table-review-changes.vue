<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../button/button.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableReviewChanges',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Number of pending altered rows. */
      alteredCount?: number
    }>(),
    {
      alteredCount: 0
    }
  )

  const emit = defineEmits<{
    discard: []
    review: []
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__review-changes`
  )
</script>

<template>
  <div
    v-if="alteredCount > 0"
    v-bind="attrs"
    class="flex items-center justify-between gap-[var(--spacing-sm)] rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-canvas)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
    :data-testid="testId"
  >
    <span class="text-body-sm text-[var(--text-default)]">
      {{ alteredCount }} pending {{ alteredCount === 1 ? 'change' : 'changes' }}
    </span>
    <div class="flex gap-[var(--spacing-xs)]">
      <Button
        label="Discard"
        kind="text"
        size="small"
        :data-testid="`${testId}__discard`"
        @click="emit('discard')"
      />
      <Button
        label="Review"
        kind="primary"
        size="small"
        :data-testid="`${testId}__review`"
        @click="emit('review')"
      />
    </div>
  </div>
</template>
