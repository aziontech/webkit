import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface DropdownMenuContext {
  testId: string
  isOpen: ComputedRef<boolean>
  closeable: boolean
  closeOnSelect: boolean
  /** Gap between trigger bottom and panel top (px). */
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
