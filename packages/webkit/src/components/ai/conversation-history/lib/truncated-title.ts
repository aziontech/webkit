export function titleWhenTruncated(event: PointerEvent): void {
  const control = event.currentTarget
  if (!(control instanceof HTMLElement)) return
  const label = control.querySelector('bdi')
  const truncated = label !== null && label.scrollWidth > label.clientWidth
  if (truncated) control.title = label.textContent ?? ''
  else control.removeAttribute('title')
}
