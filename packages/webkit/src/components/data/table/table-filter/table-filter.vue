<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { usePlacement } from '../../../../composables/use-placement'
  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import {
    type AppliedFilter,
    type FilterField,
    type FilterOperator,
    TableInjectionKey
  } from '../injection-key'

  defineOptions({
    name: 'TableFilter',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Field catalog for the built-in builder (falls back to the table's `filterFields`). */
      fields?: FilterField[]
      /** Popover heading. */
      title?: string
    }>(),
    {
      fields: () => [],
      title: 'Filters'
    }
  )

  const emit = defineEmits<{
    apply: [filters: AppliedFilter[]]
    clear: []
  }>()

  defineSlots<{
    /** Escape hatch — replace the built-in builder with a custom one (e.g. AQL). */
    default(props: {
      fields: FilterField[]
      applied: AppliedFilter[]
      apply: () => void
      clear: () => void
      remove: (filter: AppliedFilter) => void
    }): unknown
    /** Replace the default trigger button. */
    trigger(props: { open: () => void; count: number }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__filter` : 'data-table__filter')
  )

  // --- Anchored popover (use-placement + Teleport; no Drawer) -----------------
  const open = ref<boolean>(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const { panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: open,
    placement: 'bottom-end',
    offset: 4
  })
  const toggle = (): void => {
    open.value = !open.value
  }
  const close = (): void => {
    open.value = false
  }
  const onPointerDown = (event: MouseEvent): void => {
    if (!open.value) return
    const target = event.target as Node | null
    if (!target) return
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    close()
  }
  const onKeydown = (event: globalThis.KeyboardEvent): void => {
    if (open.value && event.key === 'Escape') close()
  }
  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onPointerDown)
    globalThis.document?.addEventListener('keydown', onKeydown)
  })
  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onPointerDown)
    globalThis.document?.removeEventListener('keydown', onKeydown)
  })

  const fields = computed<FilterField[]>(() =>
    props.fields.length ? props.fields : (ctx?.filterFields.value ?? [])
  )
  const applied = computed<AppliedFilter[]>(() => ctx?.appliedFilters.value ?? [])
  const count = computed<number>(() => applied.value.length)

  // Default operator set per field type; a field may override via `operators`.
  const DEFAULT_OPERATORS: Record<FilterField['type'], FilterOperator[]> = {
    text: ['contains', 'eq', 'neq', 'starts-with', 'ends-with', 'is-empty', 'is-not-empty'],
    number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
    select: ['eq', 'neq'],
    'multi-select': ['in', 'not-in'],
    boolean: ['eq'],
    date: ['eq', 'gt', 'lt', 'gte', 'lte']
  }
  const OPERATOR_LABELS: Record<FilterOperator, string> = {
    eq: 'is',
    neq: 'is not',
    contains: 'contains',
    'not-contains': 'does not contain',
    'starts-with': 'starts with',
    'ends-with': 'ends with',
    gt: 'greater than',
    gte: 'at least',
    lt: 'less than',
    lte: 'at most',
    in: 'in',
    'not-in': 'not in',
    'is-empty': 'is empty',
    'is-not-empty': 'is not empty'
  }
  const NO_VALUE_OPERATORS: FilterOperator[] = ['is-empty', 'is-not-empty']

  const draftField = ref<string>('')
  const draftOperator = ref<FilterOperator>('contains')
  const draftValue = ref<string>('')
  const editingKey = ref<string | null>(null)

  const selectedField = computed<FilterField | undefined>(() =>
    fields.value.find((field) => field.id === draftField.value)
  )
  const operators = computed<FilterOperator[]>(() =>
    selectedField.value
      ? (selectedField.value.operators ?? DEFAULT_OPERATORS[selectedField.value.type])
      : []
  )
  const valueOptions = computed<{ label: string; value: string | number | boolean }[]>(() =>
    selectedField.value?.type === 'select' ? (selectedField.value.options ?? []) : []
  )
  const needsValue = computed<boolean>(() => !NO_VALUE_OPERATORS.includes(draftOperator.value))
  const operatorLabel = (operator: FilterOperator): string => OPERATOR_LABELS[operator] ?? operator

  const filterKey = (filter: AppliedFilter): string =>
    `${filter.field}|${filter.operator}|${JSON.stringify(filter.value)}`

  const resetDraft = (): void => {
    const first = fields.value[0]
    draftField.value = first?.id ?? ''
    draftValue.value = ''
    editingKey.value = null
  }

  // When the field changes, keep the operator valid and reset the value.
  watch(draftField, () => {
    const next = operators.value
    if (!next.includes(draftOperator.value)) draftOperator.value = next[0] ?? 'eq'
    draftValue.value = ''
  })

  const commit = (): void => {
    if (!draftField.value) return
    const next: AppliedFilter = {
      field: draftField.value,
      operator: draftOperator.value,
      value: needsValue.value ? draftValue.value : ''
    }
    const current = applied.value
    const list = editingKey.value
      ? current.map((filter) => (filterKey(filter) === editingKey.value ? next : filter))
      : [...current, next]
    ctx?.applyFilters(list)
    emit('apply', list)
    resetDraft()
    close()
  }
  const clearAll = (): void => {
    ctx?.clearFilters()
    emit('clear')
    resetDraft()
  }
  const removeOne = (filter: AppliedFilter): void => ctx?.removeFilter(filter)

  // Editing a chip re-opens the popover pre-filled (the root sets ctx.editingFilter).
  watch(
    () => ctx?.editingFilter.value ?? null,
    (filter) => {
      if (!filter) return
      draftField.value = filter.field
      draftOperator.value = filter.operator
      draftValue.value = Array.isArray(filter.value)
        ? filter.value.join(', ')
        : String(filter.value)
      editingKey.value = filterKey(filter)
      open.value = true
      if (ctx) ctx.editingFilter.value = null
    }
  )

  resetDraft()
</script>

<template>
  <div class="relative inline-flex">
    <span
      ref="triggerRef"
      class="inline-flex"
    >
      <slot
        name="trigger"
        :open="() => (open = true)"
        :count="count"
      >
        <IconButton
          :data-testid="testId"
          icon="pi pi-filter"
          :ariaLabel="title"
          kind="outlined"
          size="medium"
          :aria-expanded="open"
          @click="toggle"
        />
      </slot>
    </span>

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="open"
          ref="panelRef"
          role="dialog"
          :aria-label="title"
          :data-testid="`${testId}__panel`"
          :style="panelStyle"
          class="flex min-w-[var(--container-2xs)] max-w-[var(--container-xs)] flex-col gap-[var(--spacing-sm)] rounded-[var(--shape-card)] border border-solid border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-sm)] shadow-[var(--shadow-sm)] outline-none [transform-origin:var(--popup-origin,top_left)]"
        >
          <p class="text-label-md text-[var(--text-default)]">{{ title }}</p>

          <slot
            :fields="fields"
            :applied="applied"
            :apply="commit"
            :clear="clearAll"
            :remove="removeOne"
          >
            <div class="flex flex-col gap-[var(--spacing-xs)]">
              <select
                v-model="draftField"
                :data-testid="`${testId}__field`"
                aria-label="Field"
                class="h-8 rounded-[var(--shape-elements)] border border-solid border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] text-body-sm text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
              >
                <option
                  v-for="field in fields"
                  :key="field.id"
                  :value="field.id"
                >
                  {{ field.label }}
                </option>
              </select>

              <select
                :value="draftOperator"
                :data-testid="`${testId}__operator`"
                aria-label="Operator"
                :disabled="!draftField"
                class="h-8 rounded-[var(--shape-elements)] border border-solid border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] text-body-sm text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] disabled:cursor-not-allowed disabled:opacity-60"
                @change="
                  (event) =>
                    (draftOperator = (event.target as HTMLSelectElement).value as FilterOperator)
                "
              >
                <option
                  v-for="operator in operators"
                  :key="operator"
                  :value="operator"
                >
                  {{ operatorLabel(operator) }}
                </option>
              </select>

              <select
                v-if="needsValue && valueOptions.length > 0"
                v-model="draftValue"
                :data-testid="`${testId}__value`"
                aria-label="Value"
                class="h-8 rounded-[var(--shape-elements)] border border-solid border-[length:var(--border-width-default)] border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] text-body-sm text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
              >
                <option
                  v-for="option in valueOptions"
                  :key="String(option.value)"
                  :value="String(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
              <InputText
                v-else-if="needsValue"
                v-model="draftValue"
                :data-testid="`${testId}__value`"
                placeholder="Value"
              />

              <Button
                label="Apply filter"
                size="small"
                :disabled="!draftField"
                @click="commit"
              />
            </div>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
