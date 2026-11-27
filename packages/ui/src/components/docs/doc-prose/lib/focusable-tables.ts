export function focusableTables(host: HTMLElement): void {
  for (const table of host.querySelectorAll<HTMLTableElement>('table')) {
    if (table.closest('[data-doc-chrome]')) continue
    if (table.hasAttribute('tabindex')) continue
    table.setAttribute('tabindex', '0')
  }
}
