import type { InjectionKey, Ref } from 'vue'

/**
 * What a pane publishes so an adjacent handle can move it, keyed by the pane's own
 * element — neighbours resolve from the DOM, not a fragile registration order. Every
 * member is a getter, never the ref: a handed-out ref could write past clamp/collapse.
 */
export interface ResizablePanelPaneApi {
  /** The pane's current length in px along the group axis. */
  readonly basis: () => number
  /** True when the pane has no `basis` of its own and simply absorbs what is left. */
  readonly flexible: () => boolean
  readonly min: () => number
  readonly max: () => number
  readonly collapsible: () => boolean
  readonly collapsed: () => boolean
  /** Sets the length, clamping and collapsing per the pane's own props. */
  readonly setBasis: (next: number) => void
  /** Measures the pane's rendered length — the honest start value for a drag. */
  readonly measure: () => number
}

export interface ResizablePanelContext {
  testId: string
  /** The axis the panes flow along. A handle's own orientation is the perpendicular. */
  orientation: Readonly<Ref<'horizontal' | 'vertical'>>
  /**
   * Bumped on register/unregister. The handle's DOM walk is not reactive and the pane
   * after a handle registers later; without this to invalidate on, the handle caches
   * "no pane" forever and publishes a zero aria-valuenow. Read it in the handle's computed.
   */
  revision: Readonly<Ref<number>>
  register: (el: globalThis.HTMLElement, api: ResizablePanelPaneApi) => void
  unregister: (el: globalThis.HTMLElement) => void
  paneFor: (el: globalThis.Element | null) => ResizablePanelPaneApi | null
}

export const ResizablePanelInjectionKey: InjectionKey<ResizablePanelContext> =
  Symbol('ResizablePanelContext')
