export const reducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function firstMessage(
  content: HTMLElement | null,
  older: HTMLElement | null
): Element | null {
  const items = content?.children
  if (!items) return null
  return (items[0] === older ? items[1] : items[0]) ?? null
}

function firstVisible(items: HTMLCollection, low: number, top: number): Element | undefined {
  let high = items.length - 1
  let found = -1
  while (low <= high) {
    const middle = (low + high) >> 1
    if (items[middle].getBoundingClientRect().bottom > top) {
      found = middle
      high = middle - 1
    } else low = middle + 1
  }
  return items[found]
}

export function pickAnchor(
  el: HTMLElement | null,
  content: HTMLElement | null,
  older: HTMLElement | null
) {
  const items = content?.children
  if (!el || !items) return null
  const top = el.getBoundingClientRect().top
  const anchor = older?.contains(document.activeElement)
    ? older
    : firstVisible(items, items[0] === older ? 1 : 0, top)
  return anchor ? ([anchor, anchor.getBoundingClientRect().top - top] as const) : null
}

export function observeHistory(
  root: HTMLElement | null,
  content: HTMLElement | null,
  older: HTMLElement | null,
  near: (entries: IntersectionObserverEntry[]) => void,
  resize: () => void
): [IntersectionObserver | undefined, ResizeObserver | undefined] {
  let watcher: IntersectionObserver | undefined
  if (typeof IntersectionObserver !== 'undefined' && root) {
    watcher = new IntersectionObserver(near, { root, rootMargin: '200px 0% 0% 0%' })
    if (older) watcher.observe(older)
  }
  if (typeof ResizeObserver === 'undefined' || !content || !root) return [watcher, undefined]
  const observer = new ResizeObserver(resize)
  observer.observe(content)
  observer.observe(root)
  return [watcher, observer]
}
