export function autosize(el: HTMLTextAreaElement, minRows: number, maxRows: number): void {
  const style = window.getComputedStyle(el)
  const line = Number.parseFloat(style.lineHeight) || 20
  const padding =
    (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0)
  el.style.height = 'auto'
  const min = minRows * line + padding
  const max = maxRows * line + padding
  const next = Math.min(Math.max(el.scrollHeight, min), max)
  el.style.height = `${next}px`
  el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
}
