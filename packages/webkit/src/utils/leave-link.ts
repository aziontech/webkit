import { safeWebUrl } from './safe-href'

const isPlainClick = (event: MouseEvent): boolean =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

const opensElsewhere = (link: HTMLAnchorElement): boolean =>
  link.hasAttribute('download') || (link.target !== '' && link.target !== '_self')

const jumpsInPage = (link: HTMLAnchorElement): boolean => {
  const url = new URL(link.href, window.location.href)
  const here = window.location
  return (
    url.hash !== '' &&
    url.origin === here.origin &&
    url.pathname === here.pathname &&
    url.search === here.search
  )
}

export function leavingLink(
  event: MouseEvent,
  root?: HTMLElement | null
): HTMLAnchorElement | null {
  if (!isPlainClick(event)) return null
  const target = event.target instanceof Element ? event.target : null
  const link = target?.closest<HTMLAnchorElement>('a[href]')
  if (!link || (root && !root.contains(link))) return null
  if (!safeWebUrl(link.href)) return null
  return opensElsewhere(link) || jumpsInPage(link) ? null : link
}
