<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import type { MessageKey } from '../../../../composables/use-locale'
  import { usePortalLocale, useTranslate } from '../../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../../composables/use-placement'
  import * as en from '../../../../i18n/messages/en'
  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import Badge from '../../../content/badge/badge.vue'
  import Input from '../../../inputs/input/input.vue'
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
      /** Popover heading. Empty uses the locale catalog (`Filters`). */
      title?: string
      /** Applied filters shown on the trigger; 0 counts the table's applied filters. */
      count?: number
    }>(),
    {
      fields: () => [],
      title: '',
      count: 0
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
  const { t } = useTranslate({ tableFilter: en.tableFilter })
  const portalLocale = usePortalLocale()
  const heading = computed(() => props.title || t('tableFilter.title'))
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__filter` : 'data-table__filter')
  )

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
  const count = computed<number>(() => (props.count > 0 ? props.count : applied.value.length))
  const triggerName = computed<string>(() =>
    count.value > 0
      ? t('tableFilter.triggerCount', { title: heading.value, count: count.value })
      : heading.value
  )

  const DEFAULT_OPERATORS: Record<FilterField['type'], FilterOperator[]> = {
    text: ['contains', 'eq', 'neq', 'starts-with', 'ends-with', 'is-empty', 'is-not-empty'],
    number: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'],
    select: ['eq', 'neq'],
    'multi-select': ['in', 'not-in'],
    boolean: ['eq'],
    date: ['eq', 'gt', 'lt', 'gte', 'lte']
  }
  const OPERATOR_KEYS: Record<FilterOperator, MessageKey> = {
    eq: 'tableFilter.eq',
    neq: 'tableFilter.neq',
    contains: 'tableFilter.contains',
    'not-contains': 'tableFilter.notContains',
    'starts-with': 'tableFilter.startsWith',
    'ends-with': 'tableFilter.endsWith',
    gt: 'tableFilter.gt',
    gte: 'tableFilter.gte',
    lt: 'tableFilter.lt',
    lte: 'tableFilter.lte',
    in: 'tableFilter.in',
    'not-in': 'tableFilter.notIn',
    'is-empty': 'tableFilter.isEmpty',
    'is-not-empty': 'tableFilter.isNotEmpty'
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
  const operatorLabel = (operator: FilterOperator): string =>
    OPERATOR_KEYS[operator] ? t(OPERATOR_KEYS[operator]) : operator

  const filterKey = (filter: AppliedFilter): string =>
    `${filter.field}|${filter.operator}|${JSON.stringify(filter.value)}`

  const resetDraft = (): void => {
    const first = fields.value[0]
    draftField.value = first?.id ?? ''
    draftValue.value = ''
    editingKey.value = null
  }

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
      class="relative inline-flex"
    >
      <slot
        name="trigger"
        :open="() => (open = true)"
        :count="count"
      >
        <IconButton
          :data-testid="testId"
          icon="pi pi-filter"
          :ariaLabel="triggerName"
          kind="outlined"
          size="medium"
          :aria-expanded="open"
          @click="toggle"
        />
        <span
          v-if="count > 0"
          aria-hidden="true"
          class="pointer-events-none absolute -top-2 -end-2 min-w-5"
        >
          <Badge
            :data-testid="`${testId}__count`"
            :label="String(count)"
            severity="primary"
            size="small"
            class="w-full"
          />
        </span>
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
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          :aria-label="heading"
          :data-testid="`${testId}__panel`"
          :style="panelStyle"
          class="flex min-w-(--container-2xs) max-w-(--container-xs) flex-col gap-(--spacing-sm) overflow-y-auto rounded-(--shape-card) border border-solid border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) p-(--spacing-sm) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
        >
          <p class="text-label-md text-(--text-default)">{{ heading }}</p>

          <slot
            :fields="fields"
            :applied="applied"
            :apply="commit"
            :clear="clearAll"
            :remove="removeOne"
          >
            <div class="flex flex-col gap-(--spacing-xs)">
              <select
                v-model="draftField"
                :data-testid="`${testId}__field`"
                :aria-label="t('tableFilter.field')"
                class="h-8 rounded-(--shape-elements) border border-solid border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-body-sm text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
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
                :aria-label="t('tableFilter.operator')"
                :disabled="!draftField"
                class="h-8 rounded-(--shape-elements) border border-solid border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-body-sm text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) disabled:cursor-not-allowed disabled:opacity-60"
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
                :aria-label="t('tableFilter.value')"
                class="h-8 rounded-(--shape-elements) border border-solid border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-body-sm text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
              >
                <option
                  v-for="option in valueOptions"
                  :key="String(option.value)"
                  :value="String(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
              <Input
                v-else-if="needsValue"
                v-model="draftValue"
                :data-testid="`${testId}__value`"
                :placeholder="t('tableFilter.value')"
              />

              <Button
                :label="t('tableFilter.apply')"
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
