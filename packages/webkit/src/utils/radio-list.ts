const RADIO = '[role="radio"]:not(:disabled):not([aria-disabled="true"])'
const STEP: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }

export function radioListTabIndex(
  value: string,
  chosen: string,
  values: readonly string[]
): 0 | -1 {
  const current = values.includes(chosen) ? chosen : values[0]
  return value === current ? 0 : -1
}

export function onRadioListKeydown(event: KeyboardEvent): void {
  const step = STEP[event.key]
  const host = event.currentTarget
  if (!step || !(host instanceof HTMLElement)) return
  const group = host.closest<HTMLElement>('[role="radiogroup"]')
  if (!group) return
  const radios = Array.from(group.querySelectorAll<HTMLElement>(RADIO))
  const index = radios.findIndex((radio) => radio.contains(document.activeElement))
  if (index < 0) return
  const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight'
  const flip = horizontal && getComputedStyle(group).direction === 'rtl' ? -1 : 1
  const next = radios[(index + step * flip + radios.length) % radios.length]!
  event.preventDefault()
  next.focus()
  next.click()
}
