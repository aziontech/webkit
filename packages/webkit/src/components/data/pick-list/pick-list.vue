<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'

  defineOptions({
    name: 'PickList',
    inheritAttrs: false
  })

  type PickListItems = unknown[]
  export type PickListValue = [PickListItems, PickListItems]
  type PickListSide = 'source' | 'target'
  type MoveDirection = 'to-target' | 'to-source'

  interface Props {
    /** Bound pair of lists as [sourceItems, targetItems] (v-model). */
    modelValue?: PickListValue
    /** Item field that uniquely identifies a record; enables selection tracking and stable keys. */
    dataKey?: string
    /** Heading text for the source list; also its accessible name. */
    sourceHeader?: string
    /** Heading text for the target list; also its accessible name. */
    targetHeader?: string
    /** Disables all selection and move controls and applies disabled tokens. */
    disabled?: boolean
    /** Shows up/down reorder controls that move selected items within their own list. */
    reorderable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [[], []],
    dataKey: '',
    sourceHeader: '',
    targetHeader: '',
    disabled: false,
    reorderable: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: PickListValue]
    move: [payload: { direction: MoveDirection; items: PickListItems }]
    reorder: [payload: { list: PickListSide; items: PickListItems }]
  }>()

  defineSlots<{
    item(props: { item: unknown; index: number; list: PickListSide }): unknown
    sourceHeader(): unknown
    targetHeader(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-pick-list'
  )

  const sourceItems = computed<PickListItems>(() => props.modelValue?.[0] ?? [])
  const targetItems = computed<PickListItems>(() => props.modelValue?.[1] ?? [])

  const selectedSource = ref<Set<number>>(new Set())
  const selectedTarget = ref<Set<number>>(new Set())

  const selectionFor = (list: PickListSide) => (list === 'source' ? selectedSource : selectedTarget)

  const itemKey = (item: unknown, index: number): string | number => {
    if (props.dataKey && item && typeof item === 'object') {
      const value = (item as Record<string, unknown>)[props.dataKey]
      if (typeof value === 'string' || typeof value === 'number') return value
    }
    return index
  }

  const isSelected = (list: PickListSide, index: number): boolean =>
    selectionFor(list).value.has(index)

  const toggleSelection = (list: PickListSide, index: number): void => {
    if (props.disabled) return
    const selection = selectionFor(list)
    const next = new Set(selection.value)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    selection.value = next
  }

  const onOptionKeydown = (
    list: PickListSide,
    index: number,
    event: globalThis.KeyboardEvent
  ): void => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
      toggleSelection(list, index)
    }
  }

  const emitModel = (next: PickListValue): void => {
    emit('update:modelValue', next)
  }

  const pickSelectedIndexes = (list: PickListSide): number[] =>
    [...selectionFor(list).value].sort((a, b) => a - b)

  const moveBetween = (direction: MoveDirection): void => {
    if (props.disabled) return
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
    if (props.disabled) return
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

  const reorder = (list: PickListSide, offset: -1 | 1): void => {
    if (props.disabled || !props.reorderable) return
    const indexes = pickSelectedIndexes(list)
    if (indexes.length === 0) return

    const items = list === 'source' ? [...sourceItems.value] : [...targetItems.value]
    const ordered = offset === -1 ? indexes : [...indexes].reverse()
    const nextSelection = new Set<number>()

    for (const index of ordered) {
      const swap = index + offset
      if (swap < 0 || swap >= items.length) {
        nextSelection.add(index)
        continue
      }
      const temp = items[swap]
      items[swap] = items[index]
      items[index] = temp
      nextSelection.add(swap)
    }

    if (list === 'source') emitModel([items, [...targetItems.value]])
    else emitModel([[...sourceItems.value], items])

    selectionFor(list).value = nextSelection
    emit('reorder', { list, items })
  }

  const hasSelection = (list: PickListSide): boolean => selectionFor(list).value.size > 0
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-reorderable="reorderable || null"
    class="grid items-stretch gap-[var(--spacing-sm)] grid-cols-[1fr_auto_1fr] data-[disabled]:opacity-60"
  >
    <section class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
      <h3
        :data-testid="`${testId}__source-header`"
        class="text-label-lg text-[var(--text-muted)]"
      >
        <slot name="sourceHeader">{{ sourceHeader }}</slot>
      </h3>
      <ul
        role="listbox"
        aria-multiselectable="true"
        :aria-label="sourceHeader || undefined"
        :aria-disabled="disabled || undefined"
        :data-testid="`${testId}__source-list`"
        class="m-0 flex min-h-[14rem] list-none flex-col gap-[var(--spacing-xxs)] overflow-auto rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-xs)] data-[disabled]:bg-[var(--bg-disabled)]"
        :data-disabled="disabled || null"
      >
        <li
          v-for="(item, index) in sourceItems"
          :key="itemKey(item, index)"
          role="option"
          :aria-selected="isSelected('source', index)"
          :tabindex="disabled ? -1 : 0"
          :data-selected="isSelected('source', index) || null"
          :data-testid="`${testId}__source-option`"
          class="cursor-pointer select-none rounded-[var(--shape-elements)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-md text-[var(--text-default)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[selected]:bg-[var(--bg-selected)] aria-disabled:cursor-not-allowed"
          @click="toggleSelection('source', index)"
          @keydown="onOptionKeydown('source', index, $event)"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            list="source"
          />
        </li>
      </ul>
    </section>

    <div
      class="flex flex-col items-center justify-center gap-[var(--spacing-xs)]"
      :data-testid="`${testId}__controls`"
    >
      <IconButton
        kind="outlined"
        size="medium"
        icon="pi pi-angle-right"
        ariaLabel="Move selected to target"
        :disabled="disabled || !hasSelection('source')"
        :data-testid="`${testId}__move-to-target`"
        @click="moveBetween('to-target')"
      />
      <IconButton
        kind="outlined"
        size="medium"
        icon="pi pi-angle-double-right"
        ariaLabel="Move all to target"
        :disabled="disabled || sourceItems.length === 0"
        :data-testid="`${testId}__move-all-to-target`"
        @click="moveAll('to-target')"
      />
      <IconButton
        kind="outlined"
        size="medium"
        icon="pi pi-angle-left"
        ariaLabel="Move selected to source"
        :disabled="disabled || !hasSelection('target')"
        :data-testid="`${testId}__move-to-source`"
        @click="moveBetween('to-source')"
      />
      <IconButton
        kind="outlined"
        size="medium"
        icon="pi pi-angle-double-left"
        ariaLabel="Move all to source"
        :disabled="disabled || targetItems.length === 0"
        :data-testid="`${testId}__move-all-to-source`"
        @click="moveAll('to-source')"
      />
    </div>

    <section class="flex min-w-0 flex-col gap-[var(--spacing-xs)]">
      <div class="flex items-center justify-between gap-[var(--spacing-xs)]">
        <h3
          :data-testid="`${testId}__target-header`"
          class="text-label-lg text-[var(--text-muted)]"
        >
          <slot name="targetHeader">{{ targetHeader }}</slot>
        </h3>
        <div
          v-if="reorderable"
          class="flex items-center gap-[var(--spacing-xxs)]"
          :data-testid="`${testId}__reorder`"
        >
          <IconButton
            kind="transparent"
            size="small"
            icon="pi pi-angle-up"
            ariaLabel="Move selected up"
            :disabled="disabled || !hasSelection('target')"
            :data-testid="`${testId}__reorder-up`"
            @click="reorder('target', -1)"
          />
          <IconButton
            kind="transparent"
            size="small"
            icon="pi pi-angle-down"
            ariaLabel="Move selected down"
            :disabled="disabled || !hasSelection('target')"
            :data-testid="`${testId}__reorder-down`"
            @click="reorder('target', 1)"
          />
        </div>
      </div>
      <ul
        role="listbox"
        aria-multiselectable="true"
        :aria-label="targetHeader || undefined"
        :aria-disabled="disabled || undefined"
        :data-testid="`${testId}__target-list`"
        class="m-0 flex min-h-[14rem] list-none flex-col gap-[var(--spacing-xxs)] overflow-auto rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-xs)] data-[disabled]:bg-[var(--bg-disabled)]"
        :data-disabled="disabled || null"
      >
        <li
          v-for="(item, index) in targetItems"
          :key="itemKey(item, index)"
          role="option"
          :aria-selected="isSelected('target', index)"
          :tabindex="disabled ? -1 : 0"
          :data-selected="isSelected('target', index) || null"
          :data-testid="`${testId}__target-option`"
          class="cursor-pointer select-none rounded-[var(--shape-elements)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-md text-[var(--text-default)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[selected]:bg-[var(--bg-selected)] aria-disabled:cursor-not-allowed"
          @click="toggleSelection('target', index)"
          @keydown="onOptionKeydown('target', index, $event)"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            list="target"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
