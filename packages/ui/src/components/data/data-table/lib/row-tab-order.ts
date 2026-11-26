const FOCUSABLE = 'a[href], button, input, select, textarea, [contenteditable="true"], [tabindex]'
const PARKED = 'data-row-parked'

const restore = (el: HTMLElement): void => {
  const previous = el.getAttribute(PARKED)
  if (previous) el.setAttribute('tabindex', previous)
  else el.removeAttribute('tabindex')
  el.removeAttribute(PARKED)
}

const park = (el: HTMLElement): void => {
  el.setAttribute(PARKED, el.getAttribute('tabindex') ?? '')
  el.setAttribute('tabindex', '-1')
}

const syncRow = (row: HTMLElement, current: boolean): void => {
  for (const el of row.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (el.closest('[data-focus-row]') !== row) continue
    const parked = el.hasAttribute(PARKED)
    if (current && parked) restore(el)
    else if (!current && !parked && el.tabIndex >= 0) park(el)
  }
}

export function syncRowTabOrder(root: HTMLElement | null, tabStop: string | undefined): void {
  for (const row of root?.querySelectorAll<HTMLElement>('[data-focus-row]') ?? [])
    syncRow(row, row.getAttribute('data-focus-row') === tabStop)
}

export function releaseRowTabOrder(root: HTMLElement | null): void {
  for (const el of root?.querySelectorAll<HTMLElement>(`[${PARKED}]`) ?? []) restore(el)
}
