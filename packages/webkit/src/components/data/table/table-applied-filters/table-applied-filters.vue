<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import Chip from '../../../inputs/chip/chip.vue'
  import { type AppliedFilter, type FilterOperator, TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableAppliedFilters',
    inheritAttrs: false
  })

  const emit = defineEmits<{
    remove: [event: MouseEvent, filter: AppliedFilter]
    edit: [event: MouseEvent | KeyboardEvent, filter: AppliedFilter]
  }>()

  defineSlots<{
    /** Override a single chip; receives its filter and a remove callback. */
    chip(props: { filter: AppliedFilter; remove: (event: MouseEvent) => void }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__applied-filters` : 'data-table__applied-filters')
  )

  const filters = computed<AppliedFilter[]>(() => ctx?.appliedFilters.value ?? [])

  // Human-readable operator glyphs for the default chip label.
  const OPERATOR_LABELS: Record<FilterOperator, string> = {
    eq: '=',
    neq: '≠',
    contains: 'contains',
    'not-contains': 'not contains',
    'starts-with': 'starts with',
    'ends-with': 'ends with',
    gt: '>',
    gte: '≥',
    lt: '<',
    lte: '≤',
    in: 'in',
    'not-in': 'not in',
    'is-empty': 'is empty',
    'is-not-empty': 'is not empty'
  }

  const labelOf = (filter: AppliedFilter): string => {
    if (filter.label) return filter.label
    const operator = OPERATOR_LABELS[filter.operator] ?? filter.operator
    const value = Array.isArray(filter.value) ? filter.value.join(', ') : String(filter.value)
    return `${filter.field} ${operator} ${value}`.trim()
  }

  const onRemove = (event: MouseEvent, filter: AppliedFilter): void => {
    ctx?.removeFilter(filter)
    emit('remove', event, filter)
  }
  const onEdit = (event: MouseEvent | KeyboardEvent, filter: AppliedFilter): void => {
    ctx?.editFilter(filter)
    emit('edit', event, filter)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex flex-wrap items-center gap-[var(--spacing-xs)]"
  >
    <template
      v-for="filter in filters"
      :key="filter.field + '|' + filter.operator + '|' + filter.value"
    >
      <slot
        name="chip"
        :filter="filter"
        :remove="(event: MouseEvent) => onRemove(event, filter)"
      >
        <Chip
          size="medium"
          removable
          clickable
          @remove="(event) => onRemove(event, filter)"
          @click="(event) => onEdit(event, filter)"
        >
          {{ labelOf(filter) }}
        </Chip>
      </slot>
    </template>
  </div>
</template>
