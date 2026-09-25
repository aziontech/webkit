<script setup lang="ts">
  import { useEventListener, useResizeObserver } from '@vueuse/core'
  import { computed, onMounted, provide, type Ref, ref, shallowReadonly, useAttrs } from 'vue'

  import { CarouselInjectionKey } from './injection-key'

  defineOptions({
    name: 'Carousel',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the scrollable track, announced before its contents. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: ''
  })

  defineSlots<{
    /** The slides, composed as Carousel.Item elements in reading order. */
    default(): unknown
    /** The step controls, composed as Carousel.Previous and Carousel.Next; rendered above the track. */
    controls(): unknown
  }>()

  const attrs = useAttrs()

  const track = ref<globalThis.HTMLUListElement | null>(null)
  const scrolled = ref(0)
  const visibleWidth = ref(0)
  const contentWidth = ref(0)
  const dragging = ref(false)

  let dragOrigin = 0
  let dragScrollLeft = 0
  let dragDistance = 0

  // Past this, the pointer was dragging the track rather than pressing what is under it.
  const dragThreshold = 4

  // Sub-pixel rounding leaves a fraction of a pixel at either end of a scroll.
  const roundingTolerance = 1

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-carousel'
  )

  const canScrollPrev = computed(() => scrolled.value > roundingTolerance)

  const canScrollNext = computed(
    () => scrolled.value + visibleWidth.value < contentWidth.value - roundingTolerance
  )

  const canScroll = computed(() => contentWidth.value > visibleWidth.value + roundingTolerance)

  function measure() {
    const element = track.value
    if (!element) return
    scrolled.value = element.scrollLeft
    visibleWidth.value = element.clientWidth
    contentWidth.value = element.scrollWidth
  }

  function slideStep(element: globalThis.HTMLUListElement): number {
    const slides = Array.from(element.children) as globalThis.HTMLElement[]
    if (slides.length > 1) {
      const stride = slides[1].offsetLeft - slides[0].offsetLeft
      if (stride > 0) return stride
    }
    if (slides.length > 0 && slides[0].offsetWidth > 0) return slides[0].offsetWidth
    return element.clientWidth
  }

  function step(direction: 1 | -1) {
    const element = track.value
    if (!element) return
    element.scrollBy({ left: direction * slideStep(element), behavior: 'smooth' })
  }

  function scrollPrev() {
    step(-1)
  }

  function scrollNext() {
    step(1)
  }

  // Touch and pen already scroll the track natively, with momentum; only a mouse has no
  // way to drag it, so only a mouse is taken over here.
  function startDrag(event: globalThis.PointerEvent) {
    const element = track.value
    if (!element || event.pointerType !== 'mouse' || event.button !== 0) return
    if (!canScroll.value) return
    dragging.value = true
    dragOrigin = event.clientX
    dragScrollLeft = element.scrollLeft
    dragDistance = 0
  }

  // The move and release are watched on the window, not the track: a drag that leaves the
  // row still has to move it, and still has to end when the button comes up out there.
  function moveDrag(event: globalThis.PointerEvent) {
    const element = track.value
    if (!dragging.value || !element) return
    const travelled = event.clientX - dragOrigin
    dragDistance = Math.max(dragDistance, Math.abs(travelled))
    element.scrollLeft = dragScrollLeft - travelled
    event.preventDefault()
  }

  function endDrag() {
    if (!dragging.value) return
    dragging.value = false
  }

  // A drag that ends over a link would otherwise activate it; the press only counts as a
  // click when the pointer stayed put.
  function suppressClickAfterDrag(event: globalThis.MouseEvent) {
    if (dragDistance <= dragThreshold) return
    event.preventDefault()
    event.stopPropagation()
    dragDistance = 0
  }

  useEventListener(track, 'scroll', measure, { passive: true })
  useEventListener(track, 'pointerdown', startDrag)
  useEventListener(track, 'click', suppressClickAfterDrag, { capture: true })
  useEventListener(globalThis.window, 'pointermove', moveDrag)
  useEventListener(globalThis.window, 'pointerup', endDrag)
  useEventListener(globalThis.window, 'pointercancel', endDrag)
  useResizeObserver(track, measure)
  onMounted(measure)

  provide(CarouselInjectionKey, {
    track: shallowReadonly(track) as Readonly<Ref<globalThis.HTMLUListElement | null>>,
    canScrollPrev,
    canScrollNext,
    canScroll,
    scrollPrev,
    scrollNext
  })
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-scrollable="canScroll || null"
    aria-roledescription="carousel"
    :aria-label="ariaLabel || undefined"
  >
    <div
      v-if="$slots['controls']"
      class="mb-(--spacing-lg) flex gap-(--spacing-sm)"
    >
      <slot name="controls" />
    </div>
    <ul
      ref="track"
      tabindex="0"
      :data-scrollable="canScroll || null"
      :data-dragging="dragging || null"
      class="flex snap-x snap-mandatory gap-[var(--carousel-gap,var(--spacing-md))] overflow-x-auto scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden data-[dragging]:cursor-grabbing data-[dragging]:snap-none data-[dragging]:scroll-auto data-[dragging]:select-none data-[scrollable]:not-data-[dragging]:cursor-grab focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:scroll-auto"
    >
      <slot />
    </ul>
  </section>
</template>
