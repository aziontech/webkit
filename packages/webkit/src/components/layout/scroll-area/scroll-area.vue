<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useElementListener } from '../../../composables/use-element-listener'
  import { cn } from '../../../utils/cn'
  import { useScrollFade } from './composables/use-scroll-fade'

  export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

  defineOptions({
    name: 'ScrollArea',
    inheritAttrs: false
  })

  export interface ScrollAreaProps {
    /** Scroll direction: `vertical` (lists, sidebars), `horizontal` (wide tables), `both` for two-axis overflow. */
    orientation?: ScrollAreaOrientation
    /** Accessible name when the region is not labelled by visible text; omit when content provides context. */
    ariaLabel?: string
    /** Fades the edges that still have content to scroll to, sized by the distance left on each side. */
    fade?: boolean
  }

  const props = withDefaults(defineProps<ScrollAreaProps>(), {
    orientation: 'vertical',
    ariaLabel: '',
    fade: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const viewportEl = ref<HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'scroll-area')

  const tabIndex = computed(() => (attrs['tabindex'] as string | number | undefined) ?? 0)

  const ROOT_CLASS =
    'relative min-h-0 min-w-0 [scrollbar-width:thin] [scrollbar-color:var(--border-muted)_transparent] ' +
    'data-[orientation=vertical]:overflow-y-auto data-[orientation=vertical]:overflow-x-hidden data-[orientation=horizontal]:overflow-x-auto ' +
    'data-[orientation=horizontal]:overflow-y-hidden data-[orientation=both]:overflow-auto ' +
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--border-default) motion-reduce:scroll-auto ' +
    'data-[fade]:[mask-mode:alpha] data-[fade]:[scroll-padding:var(--scroll-area-fade-size)] data-[fade]:[mask-composite:intersect] ' +
    'data-[fade]:data-[orientation=vertical]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--scroll-area-fade-cover),transparent_var(--scroll-area-fade-cover),black_calc(var(--scroll-area-fade-cover)+var(--scroll-area-fade-top)),black_calc(100%-var(--scroll-area-fade-bottom)),transparent_100%)] ' +
    'data-[fade]:data-[orientation=horizontal]:[mask-image:linear-gradient(to_right,transparent_0,black_var(--scroll-area-fade-left),black_calc(100%-var(--scroll-area-fade-right)),transparent_100%)] ' +
    'data-[fade]:data-[orientation=both]:[mask-image:linear-gradient(to_bottom,black_0,black_var(--scroll-area-fade-cover),transparent_var(--scroll-area-fade-cover),black_calc(var(--scroll-area-fade-cover)+var(--scroll-area-fade-top)),black_calc(100%-var(--scroll-area-fade-bottom)),transparent_100%),linear-gradient(to_right,transparent_0,black_var(--scroll-area-fade-left),black_calc(100%-var(--scroll-area-fade-right)),transparent_100%)] ' +
    'data-[fade]:focus-visible:ring-0 data-[fade]:focus-visible:inset-ring-1 data-[fade]:focus-visible:inset-ring-(--ring-color)'

  const { fading, fadeStyle } = useScrollFade({
    target: viewportEl,
    enabled: () => props.fade,
    vertical: () => props.orientation !== 'horizontal',
    horizontal: () => props.orientation !== 'vertical'
  })

  const SCROLL_STEP = 40

  const KEY_SCROLLS: Partial<
    Record<string, ['scrollTop' | 'scrollLeft', (viewport: HTMLElement) => number]>
  > = {
    ArrowDown: ['scrollTop', (viewport) => viewport.scrollTop + SCROLL_STEP],
    ArrowUp: ['scrollTop', (viewport) => viewport.scrollTop - SCROLL_STEP],
    ArrowRight: ['scrollLeft', (viewport) => viewport.scrollLeft + SCROLL_STEP],
    ArrowLeft: ['scrollLeft', (viewport) => viewport.scrollLeft - SCROLL_STEP],
    PageDown: ['scrollTop', (viewport) => viewport.scrollTop + viewport.clientHeight],
    PageUp: ['scrollTop', (viewport) => viewport.scrollTop - viewport.clientHeight],
    Home: ['scrollTop', () => 0],
    End: ['scrollTop', (viewport) => viewport.scrollHeight]
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    const viewport = viewportEl.value
    const scroll = KEY_SCROLLS[event.key]
    if (!viewport || !scroll) return
    const [axis, to] = scroll
    const { orientation } = props
    if (
      orientation !== 'both' &&
      orientation !== (axis === 'scrollTop' ? 'vertical' : 'horizontal')
    )
      return
    viewport[axis] = to(viewport)
    event.preventDefault()
  }

  useElementListener(viewportEl, 'keydown', onKeydown)
</script>

<template>
  <div
    ref="viewportEl"
    v-bind="$attrs"
    :class="cn(ROOT_CLASS, attrs.class as string)"
    :data-orientation="orientation"
    :data-fade="fading || null"
    :style="fadeStyle"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
    :tabindex="tabIndex"
  >
    <slot />
  </div>
</template>
