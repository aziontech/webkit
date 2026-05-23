<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useDataTableContext } from './composables/use-data-table-context'
  import type { FilterDefinition } from './injection-key'
  import { formatFilterValue } from './utils/format-filter-value'

  defineOptions({
    name: 'DataTableFilterChips',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Applied filters to display as chips. */
      appliedFilters?: FilterDefinition[]
    }>(),
    {
      appliedFilters: () => []
    }
  )

  const emit = defineEmits<{
    remove: [field: string]
    edit: [payload: { filter: FilterDefinition; event: unknown }]
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__filter-chips`
  )

  function removeFilter(field: string) {
    emit('remove', field)
  }

  function editFilter(filter: FilterDefinition, event: unknown) {
    emit('edit', { filter, event })
  }
</script>

<template>
  <div
    v-if="appliedFilters.length > 0"
    v-bind="attrs"
    class="flex flex-wrap gap-[var(--spacing-2)]"
    :data-testid="testId"
  >
    <button
      v-for="filter in appliedFilters"
      :key="filter.field"
      type="button"
      class="inline-flex cursor-pointer items-center gap-[var(--spacing-2)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-3)] py-[var(--spacing-2)] text-body-sm text-[var(--text-default)] transition-opacity duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
      :data-testid="`${testId}__chip-${filter.field}`"
      @click="(event) => editFilter(filter, event)"
      @keydown.enter="(event) => editFilter(filter, event)"
      @keydown.space.prevent="(event) => editFilter(filter, event)"
    >
      <span class="text-[var(--text-muted)]"
        >{{ filter.label }} {{ filter.matchMode ?? 'is' }}:</span
      >
      <span>{{ formatFilterValue(filter.field, filter.value) }}</span>
      <span
        class="text-[var(--text-muted)]"
        aria-hidden="true"
        @click.stop="removeFilter(filter.field)"
        >×</span
      >
    </button>
  </div>
</template>
