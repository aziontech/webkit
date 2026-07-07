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
  closable: boolean
  size: DialogSize
  open: () => void
  close: () => void
  titleId: string
  descriptionId: string
  triggerRef: Ref<HTMLElement | null>
}

export const DialogInjectionKey: InjectionKey<DialogContext> = Symbol('DialogContext')
