const SKIP = '[data-slot="citation"],[aria-hidden="true"]'

function readable(node: Element): string {
  const copy = node.cloneNode(true)
  if (!(copy instanceof Element)) return ''
  copy.querySelectorAll(SKIP).forEach((child) => child.remove())
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export function contentText(root: Element | null): string {
  if (!root) return ''
  const responses = Array.from(root.querySelectorAll('[data-slot="streaming-response"]'))
  return (responses.length ? responses : [root]).map(readable).filter(Boolean).join('\n')
}
