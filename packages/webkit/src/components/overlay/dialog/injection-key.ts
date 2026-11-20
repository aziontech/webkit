import type { InjectionKey, Ref } from 'vue'

export type DialogSize = 'small' | 'medium' | 'large'

export interface DialogContext {
  testId: string
  isOpen: Readonly<Ref<boolean>>
  /** Escape and overlay click close the overlay. */
  dismissible: boolean
  /** Content renders the close (X) button at the end of its header. */
  closable: boolean
  size: DialogSize
  open: () => void
  close: () => void
  /** Light-dismiss path (Escape, overlay click); closes only when dismissible. */
  dismiss: () => void
  titleId: string
  descriptionId: string
  /** Whether a DialogDescription is mounted; gates aria-describedby on the panel. */
  hasDescription: Readonly<Ref<boolean>>
  registerDescription: () => void
  unregisterDescription: () => void
  triggerEl: Ref<HTMLElement | null>
  /** Element focused when the overlay opened; focus returns to it when there is no trigger. */
  returnFocusEl: Ref<HTMLElement | null>
}

export const DialogInjectionKey: InjectionKey<DialogContext> = Symbol('Dialog')
