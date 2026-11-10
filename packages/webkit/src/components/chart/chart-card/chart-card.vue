<script setup lang="ts">
  import { computed, provide, readonly, ref, useAttrs, useId } from 'vue'

  import {
    ChartCardInjectionKey,
    type ChartCardMeasure,
    type ChartCardMoveDirection
  } from './injection-key'

  defineOptions({ name: 'ChartCard', inheritAttrs: false })

  interface Props {
    /** Shows the drag handle and lets the card be dragged to a new position. */
    draggable?: boolean
    /** Shows the resize handle. */
    resizable?: boolean
    /** Fewest grid columns the card may span. */
    minSpan?: number
    /** Most grid columns the card may span. */
    maxSpan?: number
    /** Smallest height in pixels the resize handle allows. */
    minHeight?: number
    /** Largest height in pixels the resize handle allows. */
    maxHeight?: number
    /** Accessible name of the card when it has no title. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    draggable: false,
    resizable: false,
    minSpan: 3,
    maxSpan: 12,
    minHeight: 240,
    maxHeight: 960,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    move: [event: globalThis.KeyboardEvent, direction: ChartCardMoveDirection]
    'drag-start': [event: globalThis.DragEvent]
    'drag-end': [event: globalThis.DragEvent]
    'resize-start': [event: globalThis.PointerEvent]
    'resize-end': [event: globalThis.PointerEvent | globalThis.KeyboardEvent]
  }>()

  const span = defineModel<number>('span', { default: 6 })
  const height = defineModel<number | undefined>('height', { default: undefined })

  defineSlots<{
    /** The parts: Header, Description, Content, Footer, ResizeHandle. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const uid = useId()
  const rootRef = ref<globalThis.HTMLElement | null>(null)
  const armed = ref(false)
  const dragging = ref(false)
  const resizing = ref(false)
  const titles = ref(0)
  const descriptions = ref(0)

  const DEFAULT_COLUMNS = 12

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'chart-chart-card')
  const titleId = `${uid}-title`
  const descriptionId = `${uid}-description`

  const hasTitle = computed(() => titles.value > 0)
  const hasDescription = computed(() => descriptions.value > 0)
  const labelledBy = computed(() => (!props.ariaLabel && hasTitle.value ? titleId : undefined))
  const describedBy = computed(() => (hasDescription.value ? descriptionId : undefined))
  const sizeVars = computed(() => ({
    '--chart-card-span': `${span.value}`,
    ...(height.value === undefined ? {} : { '--chart-card-height': `${height.value}px` })
  }))

  const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high)

  function register(counter: typeof titles) {
    counter.value += 1
    return () => {
      counter.value -= 1
    }
  }

  function measure(): ChartCardMeasure {
    const root = rootRef.value
    const grid = root?.parentElement
    if (!root || !grid)
      return { height: root?.offsetHeight ?? 0, columns: DEFAULT_COLUMNS, columnWidth: 0 }
    const style = globalThis.getComputedStyle(grid)
    const columns = style.gridTemplateColumns.split(' ').filter(Boolean).length || DEFAULT_COLUMNS
    const gap = Number.parseFloat(style.columnGap) || 0
    return {
      height: root.offsetHeight,
      columns,
      columnWidth: (grid.clientWidth + gap) / columns
    }
  }

  function setSpan(next: number) {
    const value = clamp(Math.round(next), props.minSpan, props.maxSpan)
    if (value !== span.value) span.value = value
  }

  function setHeight(next: number | undefined) {
    const value =
      next === undefined ? undefined : clamp(Math.round(next), props.minHeight, props.maxHeight)
    if (value !== height.value) height.value = value
  }

  function onDragStart(event: globalThis.DragEvent) {
    if (!armed.value) return
    dragging.value = true
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
    emit('drag-start', event)
  }

  function onDragEnd(event: globalThis.DragEvent) {
    if (!dragging.value) return
    dragging.value = false
    armed.value = false
    emit('drag-end', event)
  }

  provide(ChartCardInjectionKey, {
    testId: testId.value,
    titleId,
    descriptionId,
    hasTitle,
    hasDescription,
    draggable: computed(() => props.draggable),
    resizable: computed(() => props.resizable),
    span: readonly(span),
    height: readonly(height),
    minSpan: computed(() => props.minSpan),
    maxSpan: computed(() => props.maxSpan),
    minHeight: computed(() => props.minHeight),
    maxHeight: computed(() => props.maxHeight),
    registerTitle: () => register(titles),
    registerDescription: () => register(descriptions),
    armDrag: () => {
      if (props.draggable) armed.value = true
    },
    disarmDrag: () => {
      if (!dragging.value) armed.value = false
    },
    move: (event, direction) => emit('move', event, direction),
    measure,
    setSpan,
    setHeight,
    startResize: (event) => {
      resizing.value = true
      emit('resize-start', event)
    },
    endResize: (event) => {
      resizing.value = false
      emit('resize-end', event)
    }
  })
</script>

<template>
  <section
    ref="rootRef"
    v-bind="$attrs"
    :data-testid="testId"
    :draggable="armed ? 'true' : undefined"
    :data-draggable="draggable || null"
    :data-resizable="resizable || null"
    :data-dragging="dragging || null"
    :data-resizing="resizing || null"
    :aria-label="ariaLabel || undefined"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :style="sizeVars"
    class="relative flex min-w-0 flex-col overflow-clip rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) [grid-column:span_min(var(--chart-card-span),var(--chart-grid-columns,12))] [height:var(--chart-card-height,auto)] transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[dragging]:opacity-50"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <slot />
  </section>
</template>
