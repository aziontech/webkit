<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useChartCardContext } from '../composables/use-chart-card-context'
  import type { ChartCardMoveDirection } from '../injection-key'

  defineOptions({ name: 'ChartCardDragHandle', inheritAttrs: false })

  interface Props {
    /** Accessible name of the handle. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Move card'
  })

  const attrs = useAttrs()
  const ctx = useChartCardContext()

  const DIRECTIONS: Record<string, ChartCardMoveDirection> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__drag-handle`
  )

  function onKeydown(event: globalThis.KeyboardEvent) {
    const direction = DIRECTIONS[event.key]
    if (!direction) return
    event.preventDefault()
    ctx.move(event, direction)
  }
</script>

<template>
  <button
    v-if="ctx.draggable.value"
    v-bind="$attrs"
    type="button"
    :aria-label="ariaLabel"
    :data-testid="testId"
    class="-ml-(--spacing-xxs) inline-flex size-6 shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing"
    @pointerdown="ctx.armDrag()"
    @pointerup="ctx.disarmDrag()"
    @pointercancel="ctx.disarmDrag()"
    @keydown="onKeydown"
  >
    <i
      class="pi pi-bars"
      aria-hidden="true"
    />
  </button>
</template>
