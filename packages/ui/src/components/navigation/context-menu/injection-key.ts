import { type InjectionKey, type Ref } from 'vue'

/** State the context-menu root shares with its trigger area. */
export interface ContextMenuContext {
  /** Stable test-id prefix derived from the root component. */
  testId: string
  /** Current open state. */
  isOpen: Readonly<Ref<boolean>>
  /** Whether the root is disabled; the area then leaves the native menu alone. */
  disabled: Readonly<Ref<boolean>>
  /** The trigger area element, the fallback anchor and focus-return target. */
  areaEl: Ref<globalThis.HTMLElement | null>
  /** Opens the menu with its corner at this viewport point; `source` regains focus on close. */
  openAt: (x: number, y: number, source: globalThis.Element | null) => void
}

export const ContextMenuInjectionKey: InjectionKey<ContextMenuContext> = Symbol('ContextMenu')
