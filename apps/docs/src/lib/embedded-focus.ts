const INTERACTIONS = ['pointerdown', 'keydown'] as const

export interface FocusHost {
  parent: unknown
  addEventListener: (type: string, handler: () => void, options?: { capture?: boolean }) => void
  removeEventListener: (type: string, handler: () => void, options?: { capture?: boolean }) => void
}

export interface FocusTarget {
  focus: (options?: { preventScroll?: boolean }) => void
}

export function holdEmbeddedFocus(host: FocusHost, target: FocusTarget): () => void {
  if (host.parent === host) return () => {}
  const focus = target.focus
  const release = () => {
    target.focus = focus
    for (const type of INTERACTIONS) host.removeEventListener(type, release, { capture: true })
  }
  target.focus = function heldFocus() {}
  for (const type of INTERACTIONS) host.addEventListener(type, release, { capture: true })
  return release
}
