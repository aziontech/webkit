import type { InjectionKey, Ref } from 'vue'

export type DrawerSize = 'small' | 'medium' | 'large'
export type DrawerSide = 'left' | 'right'

export interface DrawerContext {
  testId: string
  isOpen: Readonly<Ref<boolean>>
  closeable: boolean
  size: DrawerSize
  open: () => void
  close: () => void
  titleId: string
  descriptionId: string
  triggerRef: Ref<HTMLElement | null>
  side: DrawerSide
}

export const DrawerInjectionKey: InjectionKey<DrawerContext> = Symbol('DrawerContext')
