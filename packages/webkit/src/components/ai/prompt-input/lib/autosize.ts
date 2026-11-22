export function autosize(el: HTMLTextAreaElement, minRows: number, maxRows: number): boolean {
  const style = window.getComputedStyle(el)
  const line = Number.parseFloat(style.lineHeight) || 20
  const padding =
    (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.paddingBottom) || 0)
  el.style.height = 'auto'
  const min = minRows * line + padding
  const max = maxRows * line + padding
  const content = el.scrollHeight
  const next = Math.min(Math.max(content, min), max)
  el.style.height = `${next}px`
  el.style.overflowY = content > max ? 'auto' : 'hidden'
  return content > padding + line * 1.5
}
