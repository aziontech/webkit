<script setup lang="ts">
  import { useEventListener, useResizeObserver } from '@vueuse/core'
  import { computed, onMounted, provide, type Ref, ref, shallowReadonly, useAttrs } from 'vue'

  import { resolveDirection } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { CarouselInjectionKey, type CarouselLayout } from './injection-key'

  defineOptions({
    name: 'Carousel',
    inheritAttrs: false
  })

  /** Layout of the row: one ruled strip, or standalone cards with a gutter. */
  export type CarouselVariant = CarouselLayout

  export interface CarouselProps {
    /** Accessible name for the scrollable track, announced before its contents. */
    ariaLabel?: string
    /** Layout of the row: `strip` sets the cards edge to edge as one ruled strip, `cards` separates them with a gutter and rounds each card. */
    variant?: CarouselVariant
  }

  const props = withDefaults(defineProps<CarouselProps>(), {
    ariaLabel: '',
    variant: 'strip'
  })

  const slots = defineSlots<{
    /** The slides, composed as Carousel.Item elements in reading order. */
    default(): unknown
    /** The step controls, composed as Carousel.Previous and Carousel.Next; rendered above the track, at the row's end when a header is set. */
    controls?(): unknown
    /** Content at the start of the controls row, usually the band's title; the controls move to the row's end. */
    header?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ carousel: en.carousel })

  const trackEl = ref<globalThis.HTMLUListElement | null>(null)
  const scrolled = ref(0)
  const visibleWidth = ref(0)
  const contentWidth = ref(0)
  const dragging = ref(false)

  let dragOrigin = 0
  let dragScrollLeft = 0
  let dragDistance = 0

  const dragThreshold = 4

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
    const element = trackEl.value
    if (!element) return
    scrolled.value = Math.abs(element.scrollLeft)
    visibleWidth.value = element.clientWidth
    contentWidth.value = element.scrollWidth
  }

  function slideStep(element: globalThis.HTMLUListElement): number {
    const slides = Array.from(element.children) as globalThis.HTMLElement[]
    if (slides.length > 1) {
      const stride = Math.abs(slides[1].offsetLeft - slides[0].offsetLeft)
      if (stride > 0) return stride
    }
    if (slides.length > 0 && slides[0].offsetWidth > 0) return slides[0].offsetWidth
    return element.clientWidth
  }

  function step(direction: 1 | -1) {
    const element = trackEl.value
    if (!element) return
    const sign = resolveDirection(element) === 'rtl' ? -direction : direction
    element.scrollBy({ left: sign * slideStep(element), behavior: 'smooth' })
  }

  function scrollPrev() {
    step(-1)
  }

  function scrollNext() {
    step(1)
  }

  function startDrag(event: globalThis.PointerEvent) {
    const element = trackEl.value
    if (!element || event.pointerType !== 'mouse' || event.button !== 0) return
    if (!canScroll.value) return
    dragging.value = true
    dragOrigin = event.clientX
    dragScrollLeft = element.scrollLeft
    dragDistance = 0
  }

  function moveDrag(event: globalThis.PointerEvent) {
    const element = trackEl.value
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

  function suppressClickAfterDrag(event: globalThis.MouseEvent) {
    if (dragDistance <= dragThreshold) return
    event.preventDefault()
    event.stopPropagation()
    dragDistance = 0
  }

  useEventListener(trackEl, 'scroll', measure, { passive: true })
  useEventListener(trackEl, 'pointerdown', startDrag)
  useEventListener(trackEl, 'click', suppressClickAfterDrag, { capture: true })
  useEventListener(globalThis.window, 'pointermove', moveDrag)
  useEventListener(globalThis.window, 'pointerup', endDrag)
  useEventListener(globalThis.window, 'pointercancel', endDrag)
  useResizeObserver(trackEl, measure)
  onMounted(measure)

  provide(CarouselInjectionKey, {
    variant: computed(() => props.variant),
    trackEl: shallowReadonly(trackEl) as Readonly<Ref<globalThis.HTMLUListElement | null>>,
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
    :data-can-scroll-prev="canScrollPrev || null"
    :data-can-scroll-next="canScrollNext || null"
    :data-variant="variant"
    :aria-roledescription="t('carousel.roleDescription')"
    :aria-label="ariaLabel || undefined"
  >
    <div
      v-if="slots.header || slots.controls"
      :data-header="Boolean(slots.header) || null"
      class="mb-(--spacing-lg) flex items-end gap-(--spacing-lg) data-[header]:justify-between"
    >
      <div
        v-if="slots.header"
        class="min-w-0 flex-1"
      >
        <slot name="header" />
      </div>
      <div
        v-if="slots.controls"
        class="flex shrink-0 gap-(--spacing-sm)"
      >
        <slot name="controls" />
      </div>
    </div>
    <ul
      ref="trackEl"
      tabindex="0"
      :data-scrollable="canScroll || null"
      :data-can-scroll-prev="canScrollPrev || null"
      :data-can-scroll-next="canScrollNext || null"
      :data-dragging="dragging || null"
      :data-variant="variant"
      class="data-[variant=cards]:gap-(--spacing-md) [--carousel-fade-end:0%] [--carousel-fade-start:0%] data-[can-scroll-next]:[--carousel-fade-end:12%] data-[can-scroll-prev]:[--carousel-fade-start:12%] data-[scrollable]:not-focus-visible:mask-[linear-gradient(to_right,transparent,black_var(--carousel-fade-start),black_calc(100%-var(--carousel-fade-end)),transparent)] rtl:data-[scrollable]:not-focus-visible:mask-[linear-gradient(to_left,transparent,black_var(--carousel-fade-start),black_calc(100%-var(--carousel-fade-end)),transparent)] flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden data-[dragging]:cursor-grabbing data-[dragging]:snap-none data-[dragging]:scroll-auto data-[dragging]:select-none data-[scrollable]:not-data-[dragging]:cursor-grab focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:scroll-auto"
    >
      <slot />
    </ul>
  </section>
</template>
