import { type MaybeRefOrGetter, toValue } from 'vue'

import type { PinnedRowElements } from '../use-pinned-row'

export interface PinnedRowMeasure {
  runwayHeight: string
  offset: number
}

export function measurePinnedRow(
  elements: PinnedRowElements,
  enabled: MaybeRefOrGetter<boolean>
): PinnedRowMeasure | null {
  const runway = toValue(elements.runway)
  const pinned = toValue(elements.pinned)
  const viewport = toValue(elements.viewport)
  const track = toValue(elements.track)
  if (!toValue(enabled) || !runway || !pinned || !viewport || !track) return null
  if (getComputedStyle(pinned).position !== 'sticky') return null

  const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth)
  const travelled = pinned.getBoundingClientRect().top - runway.getBoundingClientRect().top
  return {
    runwayHeight: `${pinned.offsetHeight + overflow}px`,
    offset: Math.min(overflow, Math.max(0, travelled))
  }
}

export function rowShift(offset: number, runway: HTMLElement | null): string | undefined {
  if (!offset) return undefined
  const rtl = runway?.closest('[dir]')?.getAttribute('dir') === 'rtl'
  return `${rtl ? offset : -offset}px 0`
}

export function observeRowSize(elements: PinnedRowElements, onResize: () => void): ResizeObserver {
  const observer = new ResizeObserver(onResize)
  const pinned = toValue(elements.pinned)
  const track = toValue(elements.track)
  if (pinned) observer.observe(pinned)
  if (track) observer.observe(track)
  return observer
}
