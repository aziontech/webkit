import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface CarouselContext {
  /** The scrollable track element, or null before the root mounts. */
  track: Readonly<Ref<globalThis.HTMLUListElement | null>>
  /** Whether the track has room left to step back toward its start. */
  canScrollPrev: ComputedRef<boolean>
  /** Whether the track has room left to step forward toward its end. */
  canScrollNext: ComputedRef<boolean>
  /** Whether the track's content overflows the row it sits in. */
  canScroll: ComputedRef<boolean>
  /** Steps the track back by one slide. */
  scrollPrev: () => void
  /** Steps the track forward by one slide. */
  scrollNext: () => void
}

export const CarouselInjectionKey: InjectionKey<CarouselContext> = Symbol('Carousel')
