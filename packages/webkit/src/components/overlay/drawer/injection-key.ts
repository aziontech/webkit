import type { InjectionKey, Ref } from 'vue'

export type DrawerSize = 'small' | 'medium' | 'large'
export type DrawerSide = 'left' | 'right'

export interface DrawerContext {
  testId: string
  isOpen: Readonly<Ref<boolean>>
  /** Escape and overlay click close the overlay. */
  dismissible: boolean
  /** Content renders the close (X) button at the end of its header. */
  closable: boolean
  /** Overlay, focus trap and scroll lock; false leaves the page usable. */
  modal: boolean
  size: Readonly<Ref<DrawerSize>>
  open: () => void
  close: () => void
  /** Light-dismiss path (Escape, overlay click); closes only when dismissible. */
  dismiss: () => void
  titleId: string
  descriptionId: string
  /** Whether a DrawerDescription is mounted; gates aria-describedby on the panel. */
  hasDescription: Readonly<Ref<boolean>>
  registerDescription: () => void
  unregisterDescription: () => void
  triggerEl: Ref<HTMLElement | null>
  /** Element focused when the overlay opened; focus returns to it when there is no trigger. */
  returnFocusEl: Ref<HTMLElement | null>
  side: DrawerSide
}

export const DrawerInjectionKey: InjectionKey<DrawerContext> = Symbol('Drawer')

export const DrawerPanelScrollInjectionKey: InjectionKey<boolean> = Symbol('DrawerPanelScroll')
