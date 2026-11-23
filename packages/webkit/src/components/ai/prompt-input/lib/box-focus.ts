const CONTROLS = 'textarea, button, a, input, select, label, [role="option"], [tabindex]'

export function focusFromBox(event: PointerEvent, disabled: boolean, focus: () => void): void {
  if (disabled || event.button !== 0) return
  if ((event.target as HTMLElement | null)?.closest(CONTROLS)) return
  event.preventDefault()
  focus()
}
