import type { InjectionKey, Ref } from 'vue'

// Everything the pane publishes is a GETTER, never the ref itself. The handle only ever
// reads a value at the moment of a pointer event, and handing out the ref would let a
// consumer of the context write the pane's length past the pane's own clamp and collapse
// rules (composables.md: state goes out read-only, writes go through a function).

/**
 * What a pane publishes to the group so a handle beside it can move it. Registered by
 * the pane on mount and removed on unmount, keyed by the pane's own element — which is
 * what lets a handle resolve "the pane before me" / "the pane after me" from the DOM
 * instead of from a fragile registration order.
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
   * Bumped on every register / unregister. A handle resolves its pane by walking the DOM,
   * which is not reactive — and the pane AFTER a handle registers after the handle has
   * already rendered, so without something to invalidate on, the handle would cache
   * "no pane" forever and publish `aria-valuenow="0"` for a 300px panel. Reading this in
   * the handle's computed is what makes the lookup re-run when the group's membership
   * actually changes.
   */
  revision: Readonly<Ref<number>>
  register: (el: globalThis.HTMLElement, api: ResizablePanelPaneApi) => void
  unregister: (el: globalThis.HTMLElement) => void
  paneFor: (el: globalThis.Element | null) => ResizablePanelPaneApi | null
}

export const ResizablePanelInjectionKey: InjectionKey<ResizablePanelContext> =
  Symbol('ResizablePanelContext')
