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

const NavigationMenu = NavigationMenuRoot

NavigationMenu.List = NavigationMenuList
NavigationMenu.Item = NavigationMenuItem
NavigationMenu.Trigger = NavigationMenuTrigger
NavigationMenu.Icon = NavigationMenuIcon
NavigationMenu.Content = NavigationMenuContent
NavigationMenu.Link = NavigationMenuTrigger
NavigationMenu.Portal = NavigationMenuPortal
NavigationMenu.Backdrop = NavigationMenuBackdrop
NavigationMenu.Positioner = NavigationMenuPositioner
NavigationMenu.Popup = NavigationMenuPopup
NavigationMenu.Viewport = NavigationMenuViewport
NavigationMenu.Arrow = NavigationMenuArrow

export default NavigationMenu
