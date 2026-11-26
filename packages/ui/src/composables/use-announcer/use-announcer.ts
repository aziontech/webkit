export interface UseAnnouncerReturn {
  /** Speaks the message through the page's one polite live region. */
  announce: (message: string) => void
}

const REGION_ATTRIBUTE = 'data-webkit-announcer'

const REGION_STYLE =
  'position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap'

function liveRegion(): globalThis.HTMLElement {
  const found = document.querySelector<globalThis.HTMLElement>(`[${REGION_ATTRIBUTE}]`)
  if (found) return found
  const region = document.createElement('div')
  region.setAttribute(REGION_ATTRIBUTE, '')
  region.setAttribute('role', 'status')
  region.setAttribute('aria-live', 'polite')
  region.setAttribute('aria-atomic', 'true')
  region.style.cssText = REGION_STYLE
  document.body.appendChild(region)
  return region
}

export function useAnnouncer(): UseAnnouncerReturn {
  const announce = (message: string): void => {
    if (typeof document === 'undefined' || !message) return
    const line = document.createElement('span')
    line.textContent = message
    liveRegion().replaceChildren(line)
  }
  return { announce }
}
