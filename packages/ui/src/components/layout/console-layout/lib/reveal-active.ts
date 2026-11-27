const railScroller = (from: globalThis.HTMLElement): globalThis.HTMLElement | null => {
  const limit = from.closest('nav')
  let node = from.parentElement
  while (node && limit?.contains(node)) {
    const { overflowY } = globalThis.getComputedStyle(node)
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight)
      return node
    node = node.parentElement
  }
  return null
}

export const revealActive = (root: globalThis.HTMLElement | null): void => {
  const entry = root?.querySelector<globalThis.HTMLElement>('[aria-current="page"]')
  const scroller = root && entry ? railScroller(root) : null
  if (!entry || !scroller) return
  const style = globalThis.getComputedStyle(scroller)
  const padStart = Number.parseFloat(style.scrollPaddingTop) || 0
  const padEnd = Number.parseFloat(style.scrollPaddingBottom) || 0
  const box = scroller.getBoundingClientRect()
  const rect = entry.getBoundingClientRect()
  const delta =
    rect.top < box.top + padStart
      ? rect.top - box.top - padStart
      : rect.bottom > box.bottom - padEnd
        ? rect.bottom - box.bottom + padEnd
        : 0
  if (delta) scroller.scrollTo({ top: scroller.scrollTop + delta, behavior: 'instant' })
}
