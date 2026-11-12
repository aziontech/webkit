import NavigationMenuArrow from './navigation-menu-arrow.vue'
import NavigationMenuBackdrop from './navigation-menu-backdrop.vue'
import NavigationMenuContent from './navigation-menu-content.vue'
import NavigationMenuIcon from './navigation-menu-icon.vue'
import NavigationMenuItem from './navigation-menu-item.vue'
import NavigationMenuList from './navigation-menu-list.vue'
import NavigationMenuPopup from './navigation-menu-popup.vue'
import NavigationMenuPortal from './navigation-menu-portal.vue'
import NavigationMenuPositioner from './navigation-menu-positioner.vue'
import NavigationMenuRoot from './navigation-menu-root.vue'
import NavigationMenuTrigger from './navigation-menu-trigger.vue'
import NavigationMenuViewport from './navigation-menu-viewport.vue'

type CompoundNavigationMenu = typeof NavigationMenuRoot & {
  List: typeof NavigationMenuList
  Item: typeof NavigationMenuItem
  Trigger: typeof NavigationMenuTrigger
  Icon: typeof NavigationMenuIcon
  Content: typeof NavigationMenuContent
  Link: typeof NavigationMenuTrigger
  Portal: typeof NavigationMenuPortal
  Backdrop: typeof NavigationMenuBackdrop
  Positioner: typeof NavigationMenuPositioner
  Popup: typeof NavigationMenuPopup
  Viewport: typeof NavigationMenuViewport
  Arrow: typeof NavigationMenuArrow
}

const NavigationMenu = Object.assign(NavigationMenuRoot, {
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Icon: NavigationMenuIcon,
  Content: NavigationMenuContent,
  Link: NavigationMenuTrigger,
  Portal: NavigationMenuPortal,
  Backdrop: NavigationMenuBackdrop,
  Positioner: NavigationMenuPositioner,
  Popup: NavigationMenuPopup,
  Viewport: NavigationMenuViewport,
  Arrow: NavigationMenuArrow
}) as CompoundNavigationMenu

export default NavigationMenu
export type { NavigationMenuItemLayout } from './navigation-menu-item.vue'
export type { NavigationMenuPopupKind } from './navigation-menu-popup.vue'
export type {
  NavigationMenuAlign,
  NavigationMenuCollisionPadding,
  NavigationMenuSide
} from './navigation-menu-positioner.vue'
export type { NavigationMenuOrientation, NavigationMenuValue } from './navigation-menu-root.vue'
