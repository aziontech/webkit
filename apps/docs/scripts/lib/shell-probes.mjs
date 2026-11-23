export function landmarks() {
  const ROLES = {
    HEADER: 'banner',
    NAV: 'navigation',
    ASIDE: 'complementary',
    MAIN: 'main',
    FOOTER: 'contentinfo'
  }
  const visible = (el) =>
    el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
  const nameOf = (el) => {
    const by = el.getAttribute('aria-labelledby')
    if (by)
      return by
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
        .join(' ')
    return el.getAttribute('aria-label') ?? ''
  }
  return [
    ...document.querySelectorAll(
      'header, nav, aside, main, footer, [role=navigation], [role=complementary]'
    )
  ]
    .filter((el) => visible(el) && !el.closest('[role=dialog], [inert]'))
    .filter((el) => !['presentation', 'none'].includes(el.getAttribute('role') ?? ''))
    .map((el) => ({
      role: el.getAttribute('role') ?? ROLES[el.tagName] ?? el.tagName,
      name: nameOf(el)
    }))
}

export function breaksOnlyAtHyphens(el) {
  const node = [...el.childNodes].find((child) => child.nodeType === 3)
  if (!node) return true
  const text = node.textContent ?? ''
  const range = document.createRange()
  let top = null
  for (let at = 0; at < text.length; at++) {
    range.setStart(node, at)
    range.setEnd(node, at + 1)
    const rect = range.getBoundingClientRect()
    if (!rect.width) continue
    if (top !== null && rect.top > top + 2 && !/[-\s·]/.test(text[at - 1] ?? '')) return false
    top = rect.top
  }
  return true
}

export const probeScript = `window.__docsProbe = { landmarks: ${landmarks.toString()}, breaksOnlyAtHyphens: ${breaksOnlyAtHyphens.toString()} }`
