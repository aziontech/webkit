export const layoutScale = (el: HTMLElement): number => {
  const { width } = el.getBoundingClientRect()
  return el.offsetWidth && width ? width / el.offsetWidth : 1
}

export const layoutHeight = (el: HTMLElement): number =>
  el.getBoundingClientRect().height / layoutScale(el)

export const prefersReducedMotion = (): boolean =>
  typeof globalThis.matchMedia === 'function' &&
  globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

export function slideDirectionOf(currentIndex: number, nextIndex: number): 'left' | 'right' | null {
  if (currentIndex === -1 || nextIndex === -1 || currentIndex === nextIndex) return null
  return nextIndex > currentIndex ? 'right' : 'left'
}

export function animateHeight(el: HTMLElement, from: number | null, flush: () => void): void {
  if (from === null) return
  el.style.height = ''
  const to = layoutHeight(el)
  if (Math.round(from) === Math.round(to)) return
  el.style.height = `${from}px`
  flush()
  el.style.height = `${to}px`
}

export function tabTarget(
  key: string,
  tabs: readonly { value: string }[],
  index: number
): string | undefined | null {
  const count = tabs.length
  const at = index === -1 ? 0 : index
  if (key === 'ArrowRight') return tabs[(at + 1 + count) % count]?.value
  if (key === 'ArrowLeft') return tabs[(at - 1 + count) % count]?.value
  if (key === 'Home') return tabs[0]?.value
  if (key === 'End') return tabs[count - 1]?.value
  return null
}
