<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  defineOptions({
    name: 'PickList',
    inheritAttrs: false
  })

  type PickListItems = unknown[]
  export type PickListValue = [PickListItems, PickListItems]
  type PickListSide = 'source' | 'target'
  type PickListLoading = boolean | PickListSide
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
    /** Shows a spinner in place of a list's items and locks moves while data loads. `true` loads both lists; `'source'` or `'target'` loads only that side. */
    loading?: PickListLoading
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [[], []],
    dataKey: '',
    sourceHeader: '',
    targetHeader: '',
    disabled: false,
    reorderable: false,
    loading: false
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

  const sourceLoading = computed<boolean>(
    () => props.loading === true || props.loading === 'source'
  )
  const targetLoading = computed<boolean>(
    () => props.loading === true || props.loading === 'target'
  )
  const anyLoading = computed<boolean>(() => sourceLoading.value || targetLoading.value)
  const loadingState = computed<PickListSide | 'both' | null>(() =>
    props.loading === true ? 'both' : props.loading || null
  )
  const isListLoading = (list: PickListSide): boolean =>
    list === 'source' ? sourceLoading.value : targetLoading.value

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
    if (props.disabled || isListLoading(list)) return
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

  const reorder = (list: PickListSide, offset: -1 | 1): void => {
    if (props.disabled || !props.reorderable || isListLoading(list)) return
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
    :data-loading="loadingState"
    class="grid items-stretch gap-[var(--spacing-sm)] grid-cols-1 md:grid-cols-[1fr_auto_1fr] data-[disabled]:opacity-60"
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
        :aria-busy="sourceLoading || undefined"
        :data-testid="`${testId}__source-list`"
        class="m-0 flex min-h-[14rem] list-none flex-col gap-[var(--spacing-xxs)] overflow-auto rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-xs)] data-[disabled]:bg-[var(--bg-disabled)]"
        :data-disabled="disabled || null"
        :data-loading="sourceLoading || null"
      >
        <li
          v-if="sourceLoading"
          role="presentation"
          :data-testid="`${testId}__source-loading`"
          class="flex flex-1 items-center justify-center py-[var(--spacing-md)]"
        >
          <Spinner class="size-6 text-[var(--text-muted)]" />
        </li>
        <li
          v-for="(item, index) in sourceItems"
          v-else
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
      class="flex flex-row items-center justify-center gap-[var(--spacing-xs)] md:flex-col"
      :data-testid="`${testId}__controls`"
    >
      <button
        type="button"
        :disabled="disabled || anyLoading || !hasSelection('source')"
        aria-label="Move selected to target"
        :data-testid="`${testId}__move-to-target`"
        class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
        @click="moveBetween('to-target')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4"
        >
          <path d="M4 12h13" />
          <path d="M11 6l6 6-6 6" />
        </svg>
      </button>
      <button
        type="button"
        :disabled="disabled || anyLoading || sourceItems.length === 0"
        aria-label="Move all to target"
        :data-testid="`${testId}__move-all-to-target`"
        class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
        @click="moveAll('to-target')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4"
        >
          <path d="M3 12h11" />
          <path d="M9 7l5 5-5 5" />
          <path d="M20 5v14" />
        </svg>
      </button>
      <button
        type="button"
        :disabled="disabled || anyLoading || !hasSelection('target')"
        aria-label="Move selected to source"
        :data-testid="`${testId}__move-to-source`"
        class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
        @click="moveBetween('to-source')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4"
        >
          <path d="M20 12H7" />
          <path d="M13 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        :disabled="disabled || anyLoading || targetItems.length === 0"
        aria-label="Move all to source"
        :data-testid="`${testId}__move-all-to-source`"
        class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
        @click="moveAll('to-source')"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4"
        >
          <path d="M21 12H10" />
          <path d="M15 7l-5 5 5 5" />
          <path d="M4 5v14" />
        </svg>
      </button>
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
          <button
            type="button"
            :disabled="disabled || targetLoading || !hasSelection('target')"
            aria-label="Move selected up"
            :data-testid="`${testId}__reorder-up`"
            class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
            @click="reorder('target', -1)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="size-4"
            >
              <path d="M12 20V7" />
              <path d="M6 13l6-6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            :disabled="disabled || targetLoading || !hasSelection('target')"
            aria-label="Move selected down"
            :data-testid="`${testId}__reorder-down`"
            class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
            @click="reorder('target', 1)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="size-4"
            >
              <path d="M12 4v13" />
              <path d="M6 11l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
      <ul
        role="listbox"
        aria-multiselectable="true"
        :aria-label="targetHeader || undefined"
        :aria-disabled="disabled || undefined"
        :aria-busy="targetLoading || undefined"
        :data-testid="`${testId}__target-list`"
        class="m-0 flex min-h-[14rem] list-none flex-col gap-[var(--spacing-xxs)] overflow-auto rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-xs)] data-[disabled]:bg-[var(--bg-disabled)]"
        :data-disabled="disabled || null"
        :data-loading="targetLoading || null"
      >
        <li
          v-if="targetLoading"
          role="presentation"
          :data-testid="`${testId}__target-loading`"
          class="flex flex-1 items-center justify-center py-[var(--spacing-md)]"
        >
          <Spinner class="size-6 text-[var(--text-muted)]" />
        </li>
        <li
          v-for="(item, index) in targetItems"
          v-else
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
