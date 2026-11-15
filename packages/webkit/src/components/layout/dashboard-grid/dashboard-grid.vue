<script setup lang="ts">
  import { computed, provide, ref, shallowRef, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import {
    DashboardGridInjectionKey,
    type DashboardGridLayoutItem,
    type DashboardGridMoveDirection
  } from './injection-key'

  defineOptions({ name: 'DashboardGrid', inheritAttrs: false })

  export interface DashboardGridProps {
    /** Columns of the grid in a wide container; one column below `@3xl`. */
    columns?: number
    /** Fewest columns an item may span. */
    minSpan?: number
    /** Most columns an item may span; capped at `columns`. */
    maxSpan?: number
    /** Smallest height in pixels a resize allows. */
    minHeight?: number
    /** Largest height in pixels a resize allows. */
    maxHeight?: number
    /** Shows the drag and resize handles of every card and lets the reader rearrange the board. */
    editing?: boolean
    /** Accessible name of the list of items. Empty uses the locale catalog (`Dashboard`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<DashboardGridProps>(), {
    columns: 12,
    minSpan: 3,
    maxSpan: 12,
    minHeight: 240,
    maxHeight: 960,
    editing: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'item-move': [
      event: KeyboardEvent | DragEvent,
      payload: { id: string; from: number; to: number }
    ]
    'item-resize': [
      event: PointerEvent | KeyboardEvent,
      payload: { id: string; span: number; height: number | undefined }
    ]
  }>()

  const layout = defineModel<DashboardGridLayoutItem[]>('layout', { default: () => [] })

  defineSlots<{
    /** One `DashboardGrid.Item` per layout entry, in layout order. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ dashboardGrid: en.dashboardGrid })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'dashboard-grid')
  const announcement = ref('')
  const draggingId = ref<string | null>(null)
  const labels = new Map<string, () => string>()
  const current = shallowRef<DashboardGridLayoutItem[]>(layout.value)

  watch(layout, (next) => {
    current.value = next
  })

  function commit(next: DashboardGridLayoutItem[]) {
    current.value = next
    layout.value = next
  }

  const spanCeiling = computed(() => Math.min(props.maxSpan, props.columns))
  const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)

  const indexOf = (id: string) => current.value.findIndex((item) => item.id === id)

  function labelOf(id: string) {
    return labels.get(id)?.() || t('dashboardGrid.item', { position: indexOf(id) + 1 })
  }

  function reorder(event: KeyboardEvent | DragEvent, id: string, to: number) {
    const from = indexOf(id)
    if (from < 0 || to < 0 || to >= current.value.length || from === to) return
    const next = [...current.value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item as DashboardGridLayoutItem)
    commit(next)
    announcement.value = t('dashboardGrid.moved', {
      label: labelOf(id),
      position: to + 1,
      total: next.length
    })
    emit('item-move', event, { id, from, to })
  }

  function update(id: string, patch: Partial<DashboardGridLayoutItem>) {
    const index = indexOf(id)
    const existing = current.value[index]
    if (!existing) return
    if (
      Object.entries(patch).every(
        ([key, value]) => existing[key as keyof DashboardGridLayoutItem] === value
      )
    )
      return
    const next = [...current.value]
    next[index] = { ...existing, ...patch }
    commit(next)
  }

  provide(DashboardGridInjectionKey, {
    testId: testId.value,
    editing: computed(() => props.editing),
    columns: computed(() => props.columns),
    minSpan: computed(() => Math.min(props.minSpan, spanCeiling.value)),
    maxSpan: spanCeiling,
    minHeight: computed(() => props.minHeight),
    maxHeight: computed(() => props.maxHeight),
    draggingId,
    entry: (id) => current.value.find((item) => item.id === id),
    registerLabel: (id, label) => {
      labels.set(id, label)
      return () => {
        if (labels.get(id) === label) labels.delete(id)
      }
    },
    move: (event: KeyboardEvent, id: string, direction: DashboardGridMoveDirection) =>
      reorder(event, id, indexOf(id) + (direction === 'up' || direction === 'left' ? -1 : 1)),
    startDrag: (id) => {
      draggingId.value = id
    },
    endDrag: () => {
      draggingId.value = null
    },
    drop: (event, targetId) => {
      const id = draggingId.value
      draggingId.value = null
      if (id && id !== targetId) reorder(event, id, indexOf(targetId))
    },
    setSpan: (id, next) =>
      update(id, {
        span: clamp(Math.round(next), Math.min(props.minSpan, spanCeiling.value), spanCeiling.value)
      }),
    setHeight: (id, next) =>
      update(id, {
        height:
          next === undefined ? undefined : clamp(Math.round(next), props.minHeight, props.maxHeight)
      }),
    announceResize: (event, id) => {
      const item = current.value[indexOf(id)]
      if (!item) return
      const params = { label: labelOf(id), span: item.span, columns: props.columns }
      announcement.value =
        item.height === undefined
          ? t('dashboardGrid.resized', params)
          : t('dashboardGrid.resizedWithHeight', { ...params, height: item.height })
      emit('item-resize', event, { id, span: item.span, height: item.height })
    }
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-editing="editing || null"
    class="@container/dashboard-grid w-full min-w-0"
  >
    <ul
      role="list"
      :aria-label="ariaLabel || t('dashboardGrid.label')"
      :data-testid="`${testId}__grid`"
      :style="{ '--dashboard-grid-columns': `${columns}` }"
      class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 [--dashboard-grid-grid-columns:1] @3xl/dashboard-grid:grid-cols-[repeat(var(--dashboard-grid-columns),minmax(0,1fr))] @3xl/dashboard-grid:[--dashboard-grid-grid-columns:var(--dashboard-grid-columns)]"
    >
      <slot />
    </ul>
    <p
      :data-testid="`${testId}__live`"
      class="sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ announcement }}
    </p>
  </div>
</template>
