<script setup lang="ts">
  import { computed, onScopeDispose, ref, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'

  defineOptions({ name: 'ChartCardResizeHandle', inheritAttrs: false })

  interface Props {
    /** Accessible name of the handle. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Resize card'
  })

  const attrs = useAttrs()
  const ctx = useChartCardContext()
  const handleRef = ref<globalThis.HTMLElement | null>(null)

  const HEIGHT_STEP = 24

  interface DragOrigin {
    pointerId: number
    x: number
    y: number
    span: number
    height: number
    previousHeight: number | undefined
    columnWidth: number
  }

  let origin: DragOrigin | null = null

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__resize-handle`
  )

  const valueText = computed(() => {
    const columns = `${ctx.span.value} of ${ctx.maxSpan.value} columns`
    return ctx.height.value === undefined ? columns : `${columns}, ${ctx.height.value} pixels tall`
  })

  function release() {
    const handle = handleRef.value
    if (origin && handle?.hasPointerCapture(origin.pointerId))
      handle.releasePointerCapture(origin.pointerId)
    origin = null
  }

  function onPointerDown(event: globalThis.PointerEvent) {
    if (event.button !== 0) return
    const measure = ctx.measure()
    origin = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      span: ctx.span.value,
      height: measure.height,
      previousHeight: ctx.height.value,
      columnWidth: measure.columnWidth
    }
    handleRef.value?.setPointerCapture(event.pointerId)
    event.preventDefault()
    ctx.startResize(event)
  }

  function onPointerMove(event: globalThis.PointerEvent) {
    if (!origin || event.pointerId !== origin.pointerId) return
    const dx = event.clientX - origin.x
    const dy = event.clientY - origin.y
    if (origin.columnWidth > 0) ctx.setSpan(origin.span + Math.round(dx / origin.columnWidth))
    ctx.setHeight(origin.height + dy)
  }

  function onPointerUp(event: globalThis.PointerEvent) {
    if (!origin || event.pointerId !== origin.pointerId) return
    release()
    ctx.endResize(event)
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.key === 'Escape' && origin) {
      ctx.setSpan(origin.span)
      ctx.setHeight(origin.previousHeight)
      release()
      ctx.endResize(event)
      event.preventDefault()
      return
    }
    const current = () => ctx.height.value ?? ctx.measure().height
    if (event.key === 'ArrowRight') ctx.setSpan(ctx.span.value + 1)
    else if (event.key === 'ArrowLeft') ctx.setSpan(ctx.span.value - 1)
    else if (event.key === 'ArrowDown') ctx.setHeight(current() + HEIGHT_STEP)
    else if (event.key === 'ArrowUp') ctx.setHeight(current() - HEIGHT_STEP)
    else if (event.key === 'Home') ctx.setSpan(ctx.minSpan.value)
    else if (event.key === 'End') ctx.setSpan(ctx.maxSpan.value)
    else return
    event.preventDefault()
    ctx.endResize(event)
  }

  onScopeDispose(release)
</script>

<template>
  <div
    v-if="ctx.resizable.value"
    ref="handleRef"
    v-bind="$attrs"
    role="separator"
    tabindex="0"
    :aria-label="ariaLabel"
    :aria-valuenow="ctx.span.value"
    :aria-valuemin="ctx.minSpan.value"
    :aria-valuemax="ctx.maxSpan.value"
    :aria-valuetext="valueText"
    :data-testid="testId"
    class="absolute bottom-0 right-0 z-1 flex size-6 cursor-nwse-resize touch-none items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeydown"
  >
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      class="size-2.5"
    >
      <path
        d="M9 3 3 9M9 6 6 9"
        fill="none"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>
