import NavigationMenuRoot from './navigation-menu.vue'
import NavigationMenuContent from './navigation-menu-content.vue'
import NavigationMenuItem from './navigation-menu-item.vue'
import NavigationMenuLink from './navigation-menu-link.vue'
import NavigationMenuList from './navigation-menu-list.vue'
import NavigationMenuTrigger from './navigation-menu-trigger.vue'
import NavigationMenuViewport from './navigation-menu-viewport.vue'

type CompoundNavigationMenu = typeof NavigationMenuRoot & {
  List: typeof NavigationMenuList
  Item: typeof NavigationMenuItem
  Trigger: typeof NavigationMenuTrigger
  Content: typeof NavigationMenuContent
  Link: typeof NavigationMenuLink
  Viewport: typeof NavigationMenuViewport
}

const NavigationMenu = Object.assign(NavigationMenuRoot, {
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Viewport: NavigationMenuViewport
}) as CompoundNavigationMenu

export default NavigationMenu
export type { NavigationMenuOrientation, NavigationMenuValue } from './navigation-menu.vue'
export type { NavigationMenuProps } from './navigation-menu.vue'
export type { NavigationMenuContentProps } from './navigation-menu-content.vue'
export type { NavigationMenuItemLayout } from './navigation-menu-item.vue'
export type { NavigationMenuItemProps } from './navigation-menu-item.vue'
export type { NavigationMenuLinkProps } from './navigation-menu-link.vue'
export type { NavigationMenuListProps } from './navigation-menu-list.vue'
export type { NavigationMenuTriggerProps } from './navigation-menu-trigger.vue'
export type { NavigationMenuViewportProps } from './navigation-menu-viewport.vue'
export type { NavigationMenuPopoverVariant } from './parts/navigation-menu-popover.vue'
export type {
  NavigationMenuAlign,
  NavigationMenuCollisionPadding,
  NavigationMenuSide
} from './parts/navigation-menu-positioner.vue'
