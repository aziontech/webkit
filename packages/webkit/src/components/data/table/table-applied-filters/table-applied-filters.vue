<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
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
  const { t, formatList } = useLocale({ tableAppliedFilters: en.tableAppliedFilters })
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__applied-filters` : 'data-table__applied-filters')
  )

  const filters = computed<AppliedFilter[]>(() => ctx?.appliedFilters.value ?? [])

  const OPERATOR_LABELS = computed<Record<FilterOperator, string>>(() => ({
    eq: '=',
    neq: '≠',
    contains: t('tableAppliedFilters.contains'),
    'not-contains': t('tableAppliedFilters.notContains'),
    'starts-with': t('tableAppliedFilters.startsWith'),
    'ends-with': t('tableAppliedFilters.endsWith'),
    gt: '>',
    gte: '≥',
    lt: '<',
    lte: '≤',
    in: t('tableAppliedFilters.in'),
    'not-in': t('tableAppliedFilters.notIn'),
    'is-empty': t('tableAppliedFilters.isEmpty'),
    'is-not-empty': t('tableAppliedFilters.isNotEmpty')
  }))

  const labelOf = (filter: AppliedFilter): string => {
    if (filter.label) return filter.label
    const operator = OPERATOR_LABELS.value[filter.operator] ?? filter.operator
    const value = Array.isArray(filter.value)
      ? formatList(filter.value.map(String), { type: 'unit', style: 'short' })
      : String(filter.value)
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
  <TransitionGroup
    v-bind="$attrs"
    tag="div"
    :data-testid="testId"
    class="flex flex-wrap items-center gap-(--spacing-xs)"
    move-class="transition-[transform,translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="scale-95 opacity-0"
    enter-active-class="transition-[transform,translate,scale,opacity] duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
    leave-to-class="scale-95 opacity-0"
    leave-active-class="absolute transition-[transform,translate,scale,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  >
    <template
      v-for="filter in filters"
      :key="filter.field + '|' + filter.operator + '|' + filter.value"
    >
      <slot
        v-if="$slots['chip']"
        name="chip"
        :filter="filter"
        :remove="(event: MouseEvent) => onRemove(event, filter)"
      />
      <Chip
        v-else
        size="medium"
        removable
        clickable
        @remove="(event) => onRemove(event, filter)"
        @click="(event) => onEdit(event, filter)"
      >
        {{ labelOf(filter) }}
      </Chip>
    </template>
  </TransitionGroup>
</template>
