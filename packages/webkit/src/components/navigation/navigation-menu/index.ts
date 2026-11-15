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
export type { NavigationMenuItemLayout } from './navigation-menu-item.vue'
export type { NavigationMenuPopupVariant } from './parts/navigation-menu-popup.vue'
export type {
  NavigationMenuAlign,
  NavigationMenuCollisionPadding,
  NavigationMenuSide
} from './parts/navigation-menu-positioner.vue'
