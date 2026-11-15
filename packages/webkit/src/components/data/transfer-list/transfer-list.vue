<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import {
    type MoveDirection,
    TransferListInjectionKey,
    type TransferListItems,
    type TransferListSide,
    type TransferListValue
  } from './injection-key'

  defineOptions({
    name: 'TransferList',
    inheritAttrs: false
  })

  interface Props {
    /** Item field that uniquely identifies a record (the same name as Cards); keys the selection and the rows. */
    itemKey?: string
    /** Disables all selection and move controls and applies disabled tokens. */
    disabled?: boolean
    /** When true (default), double-clicking an item moves it to the opposite list. Set false to keep `item-double-click` firing without the move. */
    moveOnDoubleClick?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    itemKey: '',
    disabled: false,
    moveOnDoubleClick: true
  })

  const emit = defineEmits<{
    move: [event: Event, payload: { direction: MoveDirection; items: TransferListItems }]
    'item-double-click': [
      event: MouseEvent,
      payload: { list: TransferListSide; item: unknown; index: number }
    ]
  }>()

  /** Bound pair of lists as [sourceItems, targetItems] (v-model). */
  const model = defineModel<TransferListValue>({ default: () => [[], []] })

  defineSlots<{
    default(props: {
      move: (event: Event, direction: MoveDirection) => void
      moveAll: (event: Event, direction: MoveDirection) => void
      hasSelection: (side: TransferListSide) => boolean
      count: (side: TransferListSide) => number
      disabled: boolean
      loading: boolean
    }): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-transfer-list'
  )

  const sourceItems = computed<TransferListItems>(() => model.value?.[0] ?? [])
  const targetItems = computed<TransferListItems>(() => model.value?.[1] ?? [])

  const items = (side: TransferListSide): TransferListItems =>
    side === 'source' ? sourceItems.value : targetItems.value

  const sourceLoading = ref(false)
  const targetLoading = ref(false)
  const anyLoading = computed(() => sourceLoading.value || targetLoading.value)
  const isLoading = (side: TransferListSide): boolean =>
    side === 'source' ? sourceLoading.value : targetLoading.value
  const setLoading = (side: TransferListSide, value: boolean): void => {
    if (side === 'source') sourceLoading.value = value
    else targetLoading.value = value
  }

  const selectedSource = ref<Set<string | number>>(new Set())
  const selectedTarget = ref<Set<string | number>>(new Set())
  const selectionFor = (side: TransferListSide) =>
    side === 'source' ? selectedSource : selectedTarget

  const keyField = computed<string>(() => props.itemKey)

  const keyOf = (item: unknown, index: number): string | number => {
    if (keyField.value && item && typeof item === 'object') {
      const value = (item as Record<string, unknown>)[keyField.value]
      if (typeof value === 'string' || typeof value === 'number') return value
    }
    return index
  }

  const keyAt = (side: TransferListSide, index: number): string | number =>
    keyOf(items(side)[index], index)

  const isSelected = (side: TransferListSide, index: number): boolean =>
    selectionFor(side).value.has(keyAt(side, index))

  const hasSelection = (side: TransferListSide): boolean => selectionFor(side).value.size > 0

  const count = (side: TransferListSide): number => items(side).length

  const toggleSelection = (side: TransferListSide, index: number): void => {
    if (props.disabled || isLoading(side)) return
    setSelected(side, index, !isSelected(side, index))
  }

  const setSelected = (side: TransferListSide, index: number, value: boolean): void => {
    if (props.disabled || isLoading(side)) return
    const selection = selectionFor(side)
    const key = keyAt(side, index)
    if (selection.value.has(key) === value) return
    const next = new Set(selection.value)
    if (value) next.add(key)
    else next.delete(key)
    selection.value = next
  }

  const emitModel = (next: TransferListValue): void => {
    model.value = next
  }

  const pickSelectedIndexes = (side: TransferListSide): number[] =>
    items(side)
      .map((_, index) => index)
      .filter((index) => isSelected(side, index))

  const move = (event: Event, direction: MoveDirection): void => {
    if (props.disabled || anyLoading.value) return
    const fromSide: TransferListSide = direction === 'to-target' ? 'source' : 'target'
    const indexes = pickSelectedIndexes(fromSide)
    if (indexes.length === 0) return

    const source = [...sourceItems.value]
    const target = [...targetItems.value]
    const from = direction === 'to-target' ? source : target
    const to = direction === 'to-target' ? target : source

    const moved = indexes.map((i) => from[i])
    const indexSet = new Set(indexes)
    const remaining = from.filter((_, i) => !indexSet.has(i))
    to.push(...moved)

    if (direction === 'to-target') emitModel([remaining, to])
    else emitModel([to, remaining])

    selectionFor(fromSide).value = new Set()
    emit('move', event, { direction, items: moved })
  }

  const moveAll = (event: Event, direction: MoveDirection): void => {
    if (props.disabled || anyLoading.value) return
    const fromSide: TransferListSide = direction === 'to-target' ? 'source' : 'target'
    const from = direction === 'to-target' ? [...sourceItems.value] : [...targetItems.value]
    if (from.length === 0) return
    const to = direction === 'to-target' ? [...targetItems.value] : [...sourceItems.value]
    to.push(...from)

    if (direction === 'to-target') emitModel([[], to])
    else emitModel([to, []])

    selectionFor(fromSide).value = new Set()
    emit('move', event, { direction, items: from })
  }

  const moveItem = (event: Event, fromSide: TransferListSide, index: number): void => {
    if (props.disabled || anyLoading.value) return
    const fromItems = fromSide === 'source' ? [...sourceItems.value] : [...targetItems.value]
    if (index < 0 || index >= fromItems.length) return

    const moved = fromItems[index]
    const remaining = fromItems.filter((_, i) => i !== index)
    const toItems = fromSide === 'source' ? [...targetItems.value] : [...sourceItems.value]
    toItems.push(moved)

    if (fromSide === 'source') emitModel([remaining, toItems])
    else emitModel([toItems, remaining])

    selectionFor(fromSide).value = new Set()
    emit('move', event, {
      direction: fromSide === 'source' ? 'to-target' : 'to-source',
      items: [moved]
    })
  }

  const itemDoubleClick = (event: MouseEvent, side: TransferListSide, index: number): void => {
    if (props.disabled || anyLoading.value) return
    const item = items(side)[index]
    emit('item-double-click', event, { list: side, item, index })
    if (!props.moveOnDoubleClick) return
    moveItem(event, side, index)
  }

  provide(TransferListInjectionKey, {
    keyField,
    disabled: computed(() => props.disabled),
    anyLoading,
    items,
    count,
    itemKey: keyOf,
    isSelected,
    toggleSelection,
    setSelected,
    hasSelection,
    move,
    moveAll,
    itemDoubleClick,
    isLoading,
    setLoading
  })

  defineExpose({ move, moveAll, hasSelection, count })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :role="disabled ? 'group' : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    class="grid grid-cols-1 items-stretch gap-(--spacing-sm) data-[disabled]:opacity-60 md:grid-cols-[1fr_auto_1fr]"
  >
    <slot
      :move="move"
      :move-all="moveAll"
      :has-selection="hasSelection"
      :count="count"
      :disabled="disabled"
      :loading="anyLoading"
    />
  </div>
</template>
