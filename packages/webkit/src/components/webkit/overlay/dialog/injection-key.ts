import type { InjectionKey, Ref } from 'vue'

export type DialogSize = 'small' | 'medium' | 'large'

export interface DialogContext {
  testId: string
  isOpen: Readonly<Ref<boolean>>
  closeable: boolean
  size: DialogSize
  open: () => void
  close: () => void
  titleId: string
  descriptionId: string
  triggerRef: Ref<HTMLElement | null>
}

export const DialogInjectionKey: InjectionKey<DialogContext> = Symbol('DialogContext')
