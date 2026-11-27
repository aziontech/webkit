export const RESIZE_FALLBACK_MIN_WIDTH = 40

const HIDDEN_CLONE_STYLE: [string, string][] = [
  ['position', 'absolute'],
  ['left', '0'],
  ['top', '0'],
  ['flex', 'none'],
  ['width', 'max-content'],
  ['max-width', 'none'],
  ['visibility', 'hidden'],
  ['pointer-events', 'none']
]

const contentClone = (cellEl: HTMLElement): HTMLElement => {
  const clone = cellEl.cloneNode(true) as HTMLElement
  clone.removeAttribute('data-grow')
  clone.removeAttribute('data-frozen')
  clone.querySelectorAll('[role="separator"]').forEach((handle) => handle.remove())
  for (const [name, value] of HIDDEN_CLONE_STYLE) clone.style.setProperty(name, value, 'important')
  return clone
}

const columnCells = (headEl: HTMLElement, tableEl: HTMLElement | null): HTMLElement[] => {
  const row = headEl.closest('[role="row"]') as HTMLElement | null
  const colIndex = row ? Array.from(row.children).indexOf(headEl) : -1
  if (!tableEl || colIndex < 0) return [headEl]
  return Array.from(tableEl.querySelectorAll<HTMLElement>('[role="row"]'))
    .map((r) => r.children[colIndex])
    .filter((c): c is HTMLElement => c instanceof globalThis.HTMLElement)
}

export const columnContentMinWidths = (headEls: HTMLElement[]): number[] => {
  const groups = headEls.map((headEl) => {
    const tableEl = headEl.closest('[role="table"], [role="treegrid"]') as HTMLElement | null
    const clones = columnCells(headEl, tableEl).map(contentClone)
    ;(tableEl ?? globalThis.document.body).append(...clones)
    return clones
  })
  const widths = groups.map(
    (clones) =>
      Math.ceil(Math.max(0, ...clones.map((c) => c.getBoundingClientRect().width))) ||
      RESIZE_FALLBACK_MIN_WIDTH
  )
  for (const clones of groups) for (const clone of clones) clone.remove()
  return widths
}
