import { type InjectionKey, type Ref } from 'vue'

import type { MenuContext, MenuOptionValue } from '../../../composables/use-menu-root'
import type { Severity } from '../../../utils/severity'

/** Side of the trigger the panel opens on; `start` and `end` follow the text direction. */
export type DropdownMenuSide = 'top' | 'bottom' | 'start' | 'end'

/** Alignment of the panel along the trigger edge. */
export type DropdownMenuAlign = 'start' | 'center' | 'end'

export type DropdownMenuItemValue = MenuOptionValue

/** Item role of an option: a plain action, an on/off setting, or one choice of a group. */
export type DropdownMenuItemType = 'default' | 'checkbox' | 'radio'

/** Colour meaning of an option: `danger` marks a destructive action such as Delete. */
export type DropdownMenuItemSeverity = Extract<Severity, 'neutral' | 'danger'>

export type DropdownMenuContext = MenuContext

/** State one sub-menu shares between its trigger row and its panel. */
export interface DropdownMenuSubContext {
  /** Stable sub-menu id, also the value of the parent level's active sub-menu. */
  id: string
  /** Element id of the sub-trigger row. */
  triggerId: string
  /** Element id of the sub-panel menu. */
  contentId: string
  /** Whether this sub-menu is open. */
  isOpen: Readonly<Ref<boolean>>
  /** Opens or closes this sub-menu; `focusFirst` moves focus into it once it renders. */
  setOpen: (value: boolean, focusFirst?: boolean) => void
  /** Whether the panel should focus its first item when it opens. */
  focusOnOpen: Ref<boolean>
  /** The sub-trigger row element, the panel's anchor and focus-return target. */
  triggerEl: Ref<globalThis.HTMLElement | null>
  /** Menu level of the panel that holds the sub-trigger. */
  parent: MenuContext
}

export const DropdownMenuGroupInjectionKey: InjectionKey<true> = Symbol('DropdownMenuGroup')

export const DropdownMenuInjectionKey: InjectionKey<DropdownMenuContext> = Symbol('DropdownMenu')

export const DropdownMenuSubInjectionKey: InjectionKey<DropdownMenuSubContext> =
  Symbol('DropdownMenuSub')
