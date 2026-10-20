<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useScrollFade } from './composables/use-scroll-fade'

  export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

  defineOptions({
    name: 'ScrollArea',
    inheritAttrs: false
  })

  interface Props {
    /** Scroll direction: `vertical` (lists, sidebars), `horizontal` (wide tables), `both` for two-axis overflow. */
    orientation?: ScrollAreaOrientation
    /** Accessible name when the region is not labelled by visible text; omit when content provides context. */
    ariaLabel?: string
    /** Fades the edges that still have content to scroll to, sized by the distance left on each side. */
    fade?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: 'vertical',
    ariaLabel: '',
    fade: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const viewportRef = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-scroll-area'
  )

  const tabIndex = computed(() => (attrs['tabindex'] as string | number | undefined) ?? 0)

  // No overscroll containment here: it stops scroll chaining on EVERY axis, even
  // one the viewport cannot scroll, so a non-overflowing ScrollArea swallowed the
  // wheel and froze the page under the pointer. Chaining is the platform default;
  // an overlay that must lock the page behind it owns that lock itself.
  const ROOT_CLASS =
    'relative min-h-0 min-w-0 [scrollbar-width:thin] [scrollbar-color:var(--border-muted)_transparent] data-[orientation=vertical]:overflow-y-auto data-[orientation=vertical]:overflow-x-hidden data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:overflow-y-hidden data-[orientation=both]:overflow-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--border-default) motion-reduce:scroll-auto data-[fade]:[mask-mode:alpha] data-[fade]:[scroll-padding:var(--scroll-area-fade-size)] data-[fade]:[mask-composite:intersect] data-[fade]:data-[orientation=vertical]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--scroll-area-fade-cover),transparent_var(--scroll-area-fade-cover),black_calc(var(--scroll-area-fade-cover)+var(--scroll-area-fade-top)),black_calc(100%-var(--scroll-area-fade-bottom)),transparent_100%)] data-[fade]:data-[orientation=horizontal]:[mask-image:linear-gradient(to_right,transparent_0,black_var(--scroll-area-fade-left),black_calc(100%-var(--scroll-area-fade-right)),transparent_100%)] data-[fade]:data-[orientation=both]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--scroll-area-fade-cover),transparent_var(--scroll-area-fade-cover),black_calc(var(--scroll-area-fade-cover)+var(--scroll-area-fade-top)),black_calc(100%-var(--scroll-area-fade-bottom)),transparent_100%),linear-gradient(to_right,transparent_0,black_var(--scroll-area-fade-left),black_calc(100%-var(--scroll-area-fade-right)),transparent_100%)] data-[fade]:focus-visible:ring-0 data-[fade]:focus-visible:inset-ring-1 data-[fade]:focus-visible:inset-ring-(--ring-color)'

  const { fading, fadeStyle } = useScrollFade({
    target: viewportRef,
    enabled: () => props.fade,
    vertical: () => props.orientation !== 'horizontal',
    horizontal: () => props.orientation !== 'vertical'
  })

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
    :class="cn(ROOT_CLASS, attrs.class as string)"
    :data-orientation="orientation"
    :data-fade="fading || null"
    :style="fadeStyle"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
    :tabindex="tabIndex"
    @keydown="handleKeyDown"
  >
    <slot />
  </div>
</template>
