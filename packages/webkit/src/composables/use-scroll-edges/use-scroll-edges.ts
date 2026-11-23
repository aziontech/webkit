import {
  type MaybeRefOrGetter,
  nextTick,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

/** How far content runs past each inline edge of a sideways scroller. */
export interface UseScrollEdgesReturn {
  /** Hidden px past the inline start edge, at most 24; 0 when 4 or less. */
  start: Readonly<Ref<number>>
  /** End fade width: the hidden px (at most 24), or the visible slice of a column cut past half or end-aligned. */
  end: Readonly<Ref<number>>
  /** Width of the columns frozen at the inline end, which the end fade sits beside. */
  endInset: Readonly<Ref<number>>
  /** Measure again; bind it to the scroller's scroll event. */
  measure: () => void
}

/** Options of useScrollEdges. */
export interface UseScrollEdgesOptions {
  /** Selector of the cells that mark column boundaries, such as the column headers. */
  columns?: string
}

const FADE_MAX = 24

const hidden = (px: number): number => (px > 4 ? Math.min(FADE_MAX, Math.round(px)) : 0)

const innerEndOf = (el: HTMLElement, rtl: boolean): number => {
  const box = el.getBoundingClientRect()
  return rtl ? box.left + el.clientLeft : box.left + el.clientLeft + el.clientWidth
}

const endEdgeOf = (inner: number, cells: HTMLElement[], rtl: boolean): number => {
  const frozen = cells.filter((cell) => cell.dataset['frozen'] === 'end')
  if (frozen.length === 0) return inner
  const edges = frozen
    .map((cell) => cell.getBoundingClientRect())
    .map((r) => (rtl ? r.right : r.left))
  return rtl ? Math.max(...edges) : Math.min(...edges)
}

const cutSlice = (el: HTMLElement, cells: HTMLElement[], edge: number, rtl: boolean): number => {
  for (const cell of cells) {
    if (cell.dataset['frozen']) continue
    const r = cell.getBoundingClientRect()
    if (r.left >= edge - 0.5 || r.right <= edge + 0.5) continue
    const slice = rtl ? r.right - edge : edge - r.left
    const padding = Number.parseFloat(getComputedStyle(cell).paddingInlineEnd) || 0
    const valueCut =
      r.width - slice > padding && cell.matches('[data-align=end], :has(> [data-align=end])')
    return (valueCut || slice < r.width / 2) && slice <= el.clientWidth / 2 ? Math.round(slice) : 0
  }
  return 0
}

export function useScrollEdges(
  scroller: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseScrollEdgesOptions = {}
): UseScrollEdgesReturn {
  const start = ref<number>(0)
  const end = ref<number>(0)
  const endInset = ref<number>(0)
  let observer: ResizeObserver | null = null

  const measure = (): void => {
    const el = toValue(scroller)
    if (!el) return
    const offset = Math.abs(el.scrollLeft)
    start.value = hidden(offset)
    const fade = hidden(el.scrollWidth - el.clientWidth - offset)
    const cells = options.columns
      ? Array.from(el.querySelectorAll<HTMLElement>(options.columns))
      : []
    if (fade === 0 || cells.length === 0) {
      end.value = fade
      endInset.value = 0
      return
    }
    const rtl = getComputedStyle(el).direction === 'rtl'
    const inner = innerEndOf(el, rtl)
    const edge = endEdgeOf(inner, cells, rtl)
    endInset.value = Math.max(0, Math.round(Math.abs(inner - edge)))
    end.value = Math.max(fade, cutSlice(el, cells, edge, rtl))
  }

  onMounted(() => {
    void nextTick(() => {
      measure()
      const el = toValue(scroller)
      if (!el || typeof ResizeObserver === 'undefined') return
      observer = new ResizeObserver(measure)
      observer.observe(el)
      if (el.firstElementChild) observer.observe(el.firstElementChild)
    })
  })
  onScopeDispose(() => {
    observer?.disconnect()
    observer = null
  })

  return { start: readonly(start), end: readonly(end), endInset: readonly(endInset), measure }
}
