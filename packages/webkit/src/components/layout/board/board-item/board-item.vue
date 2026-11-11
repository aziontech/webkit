<script setup lang="ts">
  import { computed, nextTick, onScopeDispose, provide, ref, useAttrs } from 'vue'

  import { useBoardContext } from '../composables/use-board-context'
  import {
    BoardItemInjectionKey,
    type BoardMeasure,
    type BoardMoveDirection
  } from '../injection-key'

  defineOptions({ name: 'BoardItem', inheritAttrs: false })

  interface Props {
    /** The `id` of this item's entry in the board's layout. */
    itemId: string
    /** The name the live region announces when the item moves or resizes. Empty uses `Item <position>`. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: ''
  })

  defineSlots<{
    /** The item's content, normally one `ChartCard`. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const board = useBoardContext()
  const rootRef = ref<globalThis.HTMLElement | null>(null)
  const over = ref(false)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${board.testId}-item`
  )
  const entry = computed(() => board.entry(props.itemId))
  const span = computed(() => entry.value?.span ?? board.maxSpan.value)
  const height = computed(() => entry.value?.height)
  const sizeVars = computed(() => ({
    '--board-item-span': `${span.value}`,
    ...(height.value === undefined ? {} : { '--board-item-height': `${height.value}px` })
  }))
  const droppable = computed(
    () => board.draggingId.value !== null && board.draggingId.value !== props.itemId
  )

  onScopeDispose(board.registerLabel(props.itemId, () => props.label))

  function measure(): BoardMeasure {
    const root = rootRef.value
    const grid = root?.parentElement
    if (!root || !grid) return { height: root?.offsetHeight ?? 0, columns: 1, columnWidth: 0 }
    const style = globalThis.getComputedStyle(grid)
    const columns = style.gridTemplateColumns.split(' ').filter(Boolean).length || 1
    const gap = Number.parseFloat(style.columnGap) || 0
    return { height: root.offsetHeight, columns, columnWidth: (grid.clientWidth + gap) / columns }
  }

  async function move(_event: globalThis.KeyboardEvent, direction: BoardMoveDirection) {
    const active = globalThis.document?.activeElement
    board.move(props.itemId, direction)
    await nextTick()
    if (
      active instanceof globalThis.HTMLElement &&
      rootRef.value?.contains(active) &&
      globalThis.document.activeElement !== active
    )
      active.focus()
  }

  function onDragOver(event: globalThis.DragEvent) {
    if (!droppable.value) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    over.value = true
  }

  function onDragLeave(event: globalThis.DragEvent) {
    const next = event.relatedTarget
    if (next instanceof globalThis.Node && rootRef.value?.contains(next)) return
    over.value = false
  }

  function onDrop(event: globalThis.DragEvent) {
    over.value = false
    if (!droppable.value) return
    event.preventDefault()
    board.drop(props.itemId)
  }

  provide(BoardItemInjectionKey, {
    id: props.itemId,
    editing: board.editing,
    span,
    height,
    minSpan: board.minSpan,
    maxSpan: board.maxSpan,
    minHeight: board.minHeight,
    maxHeight: board.maxHeight,
    move,
    dragStart: (event) => {
      event.dataTransfer?.setData('text/plain', props.itemId)
      board.startDrag(props.itemId)
    },
    dragEnd: () => {
      over.value = false
      board.endDrag()
    },
    measure,
    setSpan: (next) => board.setSpan(props.itemId, next),
    setHeight: (next) => board.setHeight(props.itemId, next),
    startResize: () => undefined,
    endResize: () => board.announceResize(props.itemId)
  })
</script>

<template>
  <li
    ref="rootRef"
    v-bind="$attrs"
    :data-testid="testId"
    :data-item-id="itemId"
    :data-over="over || null"
    :style="sizeVars"
    class="flex min-w-0 flex-col rounded-(--shape-card) [grid-column:span_min(var(--board-item-span),var(--board-grid-columns,1))] [height:var(--board-item-height,auto)] transition-shadow duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[over]:ring-2 data-[over]:ring-(--ring-color) data-[over]:ring-offset-2 data-[over]:ring-offset-(--bg-canvas)"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <slot />
  </li>
</template>
