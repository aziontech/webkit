import type { InjectionKey, Ref } from 'vue'

import type { DrawerMotionState } from './presets/transitions'

export type DrawerSize = 'small' | 'medium' | 'large'
export type DrawerSide = 'left' | 'right'

export interface DrawerMotionContext {
  motionState: Readonly<Ref<DrawerMotionState>>
}

export const DrawerMotionInjectionKey: InjectionKey<DrawerMotionContext> =
  Symbol('DrawerMotionContext')

export interface DrawerContext {
  testId: string
  isOpen: Readonly<Ref<boolean>>
  closeable: boolean
  size: Readonly<Ref<DrawerSize>>
  open: () => void
  close: () => void
  titleId: string
  descriptionId: string
  triggerRef: Ref<HTMLElement | null>
  side: DrawerSide
}

export const DrawerInjectionKey: InjectionKey<DrawerContext> = Symbol('DrawerContext')

/** Set by `drawer-content` so panel regions defer scrolling to its `ScrollArea`. */
export const DrawerPanelScrollInjectionKey: InjectionKey<boolean> = Symbol('DrawerPanelScroll')
