<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'

  export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

  defineOptions({
    name: 'ScrollArea',
    inheritAttrs: false
  })

  interface Props {
    /**
     * Scroll direction. `vertical` is the default for lists and sidebars;
     * use `horizontal` for wide tables; `both` for two-axis overflow.
     */
    orientation?: ScrollAreaOrientation
    /**
     * Accessible name when the scroll region is not labelled by visible text.
     * Omit when content provides sufficient context (e.g. inside a nav landmark).
     */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: 'vertical',
    ariaLabel: undefined
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const viewportRef = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-scroll-area'
  )

  const overflowClasses: Record<ScrollAreaOrientation, string> = {
    vertical: 'overflow-y-auto overflow-x-hidden',
    horizontal: 'overflow-x-auto overflow-y-hidden',
    both: 'overflow-auto'
  }

  const rootClasses = computed(() =>
    cn(
      'relative min-h-0 min-w-0 overscroll-contain',
      '[scrollbar-width:thin] [scrollbar-color:var(--border-muted)_transparent]',
      overflowClasses[props.orientation],
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--border-default)]',
      'motion-reduce:scroll-auto',
      attrs.class
    )
  )

  const scrollStep = 40

  const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    const viewport = viewportRef.value
    if (!viewport) return

    const { orientation } = props
    const vertical = orientation === 'vertical' || orientation === 'both'
    const horizontal = orientation === 'horizontal' || orientation === 'both'

    switch (event.key) {
      case 'ArrowDown':
        if (!vertical) return
        viewport.scrollTop += scrollStep
        event.preventDefault()
        break
      case 'ArrowUp':
        if (!vertical) return
        viewport.scrollTop -= scrollStep
        event.preventDefault()
        break
      case 'ArrowRight':
        if (!horizontal) return
        viewport.scrollLeft += scrollStep
        event.preventDefault()
        break
      case 'ArrowLeft':
        if (!horizontal) return
        viewport.scrollLeft -= scrollStep
        event.preventDefault()
        break
      case 'PageDown':
        if (!vertical) return
        viewport.scrollTop += viewport.clientHeight
        event.preventDefault()
        break
      case 'PageUp':
        if (!vertical) return
        viewport.scrollTop -= viewport.clientHeight
        event.preventDefault()
        break
      case 'Home':
        if (!vertical) return
        viewport.scrollTop = 0
        event.preventDefault()
        break
      case 'End':
        if (!vertical) return
        viewport.scrollTop = viewport.scrollHeight
        event.preventDefault()
        break
      default:
        break
    }
  }
</script>

<template>
  <div
    ref="viewportRef"
    :class="rootClasses"
    :data-orientation="orientation"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
    tabindex="0"
    @keydown="handleKeyDown"
  >
    <slot />
  </div>
</template>
