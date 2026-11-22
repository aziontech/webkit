export function chipFrom(
  host: HTMLElement | null,
  target: globalThis.EventTarget | null
): HTMLElement | null {
  const node = target instanceof globalThis.Element ? target : null
  const chip = node?.closest('code') as HTMLElement | null
  if (!chip || !host?.contains(chip) || chip.closest('pre') || chip.closest('a')) return null
  if (chip.closest('[data-code-copy]') !== host) return null
  if (chip.dataset['testid'] || chip.childElementCount > 0) return null
  return chip
}

export function decorateChips(host: HTMLElement, labelOf: (value: string) => string): void {
  for (const chip of host.querySelectorAll<HTMLElement>('code[data-command]')) {
    if (chip !== chipFrom(host, chip)) continue
    if (chip.getAttribute('role') !== 'button') chip.setAttribute('role', 'button')
    if (chip.getAttribute('tabindex') !== '0') chip.setAttribute('tabindex', '0')
    const label = labelOf(chip.textContent ?? '')
    if (chip.getAttribute('aria-label') !== label) chip.setAttribute('aria-label', label)
  }
}

export function copyShortcut(ctrlLabel: string): string {
  return typeof navigator !== 'undefined' &&
    /mac/i.test(navigator.platform || navigator.userAgent || '')
    ? '⌘C'
    : `${ctrlLabel}+C`
}
