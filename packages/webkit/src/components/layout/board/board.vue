<script setup lang="ts">
  import { computed, provide, ref, shallowRef, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { BoardInjectionKey, type BoardLayoutItem, type BoardMoveDirection } from './injection-key'

  defineOptions({ name: 'Board', inheritAttrs: false })

  interface Props {
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

  const props = withDefaults(defineProps<Props>(), {
    columns: 12,
    minSpan: 3,
    maxSpan: 12,
    minHeight: 240,
    maxHeight: 960,
    editing: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    'item-move': [payload: { id: string; from: number; to: number }]
    'item-resize': [payload: { id: string; span: number; height: number | undefined }]
  }>()

  const layout = defineModel<BoardLayoutItem[]>('layout', { default: () => [] })

  defineSlots<{
    /** One `Board.Item` per layout entry, in layout order. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ board: en.board })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-board')
  const announcement = ref('')
  const draggingId = ref<string | null>(null)
  const labels = new Map<string, () => string>()
  const current = shallowRef<BoardLayoutItem[]>(layout.value)

  watch(layout, (next) => {
    current.value = next
  })

  function commit(next: BoardLayoutItem[]) {
    current.value = next
    layout.value = next
  }

  const spanCeiling = computed(() => Math.min(props.maxSpan, props.columns))
  const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)

  const indexOf = (id: string) => current.value.findIndex((item) => item.id === id)

  function labelOf(id: string) {
    return labels.get(id)?.() || t('board.item', { position: indexOf(id) + 1 })
  }

  function reorder(id: string, to: number) {
    const from = indexOf(id)
    if (from < 0 || to < 0 || to >= current.value.length || from === to) return
    const next = [...current.value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item as BoardLayoutItem)
    commit(next)
    announcement.value = t('board.moved', {
      label: labelOf(id),
      position: to + 1,
      total: next.length
    })
    emit('item-move', { id, from, to })
  }

  function update(id: string, patch: Partial<BoardLayoutItem>) {
    const index = indexOf(id)
    const existing = current.value[index]
    if (!existing) return
    if (
      Object.entries(patch).every(
        ([key, value]) => existing[key as keyof BoardLayoutItem] === value
      )
    )
      return
    const next = [...current.value]
    next[index] = { ...existing, ...patch }
    commit(next)
  }

  provide(BoardInjectionKey, {
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
    move: (id: string, direction: BoardMoveDirection) =>
      reorder(id, indexOf(id) + (direction === 'up' || direction === 'left' ? -1 : 1)),
    startDrag: (id) => {
      draggingId.value = id
    },
    endDrag: () => {
      draggingId.value = null
    },
    drop: (targetId) => {
      const id = draggingId.value
      draggingId.value = null
      if (id && id !== targetId) reorder(id, indexOf(targetId))
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
    announceResize: (id) => {
      const item = current.value[indexOf(id)]
      if (!item) return
      const params = { label: labelOf(id), span: item.span, columns: props.columns }
      announcement.value =
        item.height === undefined
          ? t('board.resized', params)
          : t('board.resizedWithHeight', { ...params, height: item.height })
      emit('item-resize', { id, span: item.span, height: item.height })
    }
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-editing="editing || null"
    class="@container/board w-full min-w-0"
  >
    <ul
      role="list"
      :aria-label="ariaLabel || t('board.label')"
      :data-testid="`${testId}__grid`"
      :style="{ '--board-columns': `${columns}` }"
      class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 [--board-grid-columns:1] @3xl/board:grid-cols-[repeat(var(--board-columns),minmax(0,1fr))] @3xl/board:[--board-grid-columns:var(--board-columns)]"
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
