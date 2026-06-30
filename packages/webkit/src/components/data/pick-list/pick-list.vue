<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import {
    type MoveDirection,
    pickListContextKey,
    type PickListItems,
    type PickListSide,
    type PickListValue
  } from './injection-key'

  defineOptions({
    name: 'PickList',
    inheritAttrs: false
  })

  interface Props {
    /** Bound pair of lists as [sourceItems, targetItems] (v-model). */
    modelValue?: PickListValue
    /** Item field that uniquely identifies a record; enables selection tracking and stable keys. */
    dataKey?: string
    /** Disables all selection and move controls and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [[], []],
    dataKey: '',
    disabled: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: PickListValue]
    move: [payload: { direction: MoveDirection; items: PickListItems }]
    reorder: [payload: { list: PickListSide; items: PickListItems }]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-pick-list'
  )

  const sourceItems = computed<PickListItems>(() => props.modelValue?.[0] ?? [])
  const targetItems = computed<PickListItems>(() => props.modelValue?.[1] ?? [])

  const items = (side: PickListSide): PickListItems =>
    side === 'source' ? sourceItems.value : targetItems.value

  const sourceLoading = ref(false)
  const targetLoading = ref(false)
  const anyLoading = computed(() => sourceLoading.value || targetLoading.value)
  const isLoading = (side: PickListSide): boolean =>
    side === 'source' ? sourceLoading.value : targetLoading.value
  const setLoading = (side: PickListSide, value: boolean): void => {
    if (side === 'source') sourceLoading.value = value
    else targetLoading.value = value
  }

  const selectedSource = ref<Set<number>>(new Set())
  const selectedTarget = ref<Set<number>>(new Set())
  const selectionFor = (side: PickListSide) => (side === 'source' ? selectedSource : selectedTarget)

  const itemKey = (item: unknown, index: number): string | number => {
    if (props.dataKey && item && typeof item === 'object') {
      const value = (item as Record<string, unknown>)[props.dataKey]
      if (typeof value === 'string' || typeof value === 'number') return value
    }
    return index
  }

  const isSelected = (side: PickListSide, index: number): boolean =>
    selectionFor(side).value.has(index)

  const hasSelection = (side: PickListSide): boolean => selectionFor(side).value.size > 0

  const count = (side: PickListSide): number => items(side).length

  const toggleSelection = (side: PickListSide, index: number): void => {
    if (props.disabled || isLoading(side)) return
    const selection = selectionFor(side)
    const next = new Set(selection.value)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    selection.value = next
  }

  const emitModel = (next: PickListValue): void => {
    emit('update:modelValue', next)
  }

  const pickSelectedIndexes = (side: PickListSide): number[] =>
    [...selectionFor(side).value].sort((a, b) => a - b)

  const move = (direction: MoveDirection): void => {
    if (props.disabled || anyLoading.value) return
    const fromSide: PickListSide = direction === 'to-target' ? 'source' : 'target'
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
    emit('move', { direction, items: moved })
  }

  const moveAll = (direction: MoveDirection): void => {
    if (props.disabled || anyLoading.value) return
    const fromSide: PickListSide = direction === 'to-target' ? 'source' : 'target'
    const from = direction === 'to-target' ? [...sourceItems.value] : [...targetItems.value]
    if (from.length === 0) return
    const to = direction === 'to-target' ? [...targetItems.value] : [...sourceItems.value]
    to.push(...from)

    if (direction === 'to-target') emitModel([[], to])
    else emitModel([to, []])

    selectionFor(fromSide).value = new Set()
    emit('move', { direction, items: from })
  }

  const reorder = (side: PickListSide, offset: -1 | 1): void => {
    if (props.disabled || isLoading(side)) return
    const indexes = pickSelectedIndexes(side)
    if (indexes.length === 0) return

    const list = side === 'source' ? [...sourceItems.value] : [...targetItems.value]
    const ordered = offset === -1 ? indexes : [...indexes].reverse()
    const nextSelection = new Set<number>()

    for (const index of ordered) {
      const swap = index + offset
      if (swap < 0 || swap >= list.length) {
        nextSelection.add(index)
        continue
      }
      const temp = list[swap]
      list[swap] = list[index]
      list[index] = temp
      nextSelection.add(swap)
    }

    if (side === 'source') emitModel([list, [...targetItems.value]])
    else emitModel([[...sourceItems.value], list])

    selectionFor(side).value = nextSelection
    emit('reorder', { list: side, items: list })
  }

  provide(pickListContextKey, {
    dataKey: computed(() => props.dataKey),
    disabled: computed(() => props.disabled),
    anyLoading,
    items,
    count,
    itemKey,
    isSelected,
    toggleSelection,
    hasSelection,
    move,
    moveAll,
    reorder,
    isLoading,
    setLoading
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    class="grid grid-cols-1 items-stretch gap-[var(--spacing-sm)] data-[disabled]:opacity-60 md:grid-cols-[1fr_auto_1fr]"
  >
    <slot />
  </div>
</template>
