export function leavingLink(
  event: MouseEvent,
  root?: HTMLElement | null
): HTMLAnchorElement | null {
  if (event.button !== 0) return null
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const target = event.target instanceof Element ? event.target : null
  const link = target?.closest<HTMLAnchorElement>('a[href]')
  if (!link || (root && !root.contains(link))) return null
  if (link.hasAttribute('download') || (link.target && link.target !== '_self')) return null
  const url = new URL(link.href, window.location.href)
  const here = window.location
  const samePage =
    url.origin === here.origin && url.pathname === here.pathname && url.search === here.search
  return samePage && url.hash ? null : link
}
