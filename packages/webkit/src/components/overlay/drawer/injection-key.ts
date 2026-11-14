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
  /** Escape and overlay click close the overlay. */
  dismissible: boolean
  /** The close button and close() close the overlay. */
  closable: boolean
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
  triggerRef: Ref<HTMLElement | null>
  /** Element focused when the overlay opened; focus returns to it when there is no trigger. */
  returnFocusRef: Ref<HTMLElement | null>
  side: DrawerSide
}

export const DrawerInjectionKey: InjectionKey<DrawerContext> = Symbol('DrawerContext')

export const DrawerPanelScrollInjectionKey: InjectionKey<boolean> = Symbol('DrawerPanelScroll')
