import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { DropdownMenuSide } from './position-panel'

export interface DropdownMenuContext {
  testId: string
  isOpen: ComputedRef<boolean>
  closeable: boolean
  closeOnSelect: boolean
  /** Preferred panel placement relative to the trigger. */
  side: DropdownMenuSide
  /** Gap between trigger and panel (px). */
  sideOffset: number
  /** Horizontal offset from trigger left (px). */
  alignOffset: number
  open: () => void
  close: () => void
  triggerRef: Ref<HTMLElement | null>
  menuId: string
}

export const DropdownMenuInjectionKey: InjectionKey<DropdownMenuContext> =
  Symbol('DropdownMenuContext')
