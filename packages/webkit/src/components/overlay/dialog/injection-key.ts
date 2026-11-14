import type { InjectionKey, Ref } from 'vue'

import type { DialogMotionState } from './presets/transitions'

export type DialogSize = 'small' | 'medium' | 'large'

export interface DialogMotionContext {
  motionState: Readonly<Ref<DialogMotionState>>
}

export const DialogMotionInjectionKey: InjectionKey<DialogMotionContext> =
  Symbol('DialogMotionContext')

export interface DialogContext {
  testId: string
  isOpen: Readonly<Ref<boolean>>
  /** Escape and overlay click close the overlay. */
  dismissible: boolean
  /** The close button and close() close the overlay. */
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
  triggerRef: Ref<HTMLElement | null>
  /** Element focused when the overlay opened; focus returns to it when there is no trigger. */
  returnFocusRef: Ref<HTMLElement | null>
}

export const DialogInjectionKey: InjectionKey<DialogContext> = Symbol('DialogContext')
