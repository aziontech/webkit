import MenuRoot from './menu.vue'
import MenuBack from './menu-back/menu-back.vue'
import MenuGroup from './menu-group/menu-group.vue'
import MenuItem from './menu-item/menu-item.vue'
import MenuSub from './menu-sub/menu-sub.vue'
import MenuSubContent from './menu-sub-content/menu-sub-content.vue'
import MenuSubTrigger from './menu-sub-trigger/menu-sub-trigger.vue'

/**
 * The attached members, named explicitly rather than inferred. `Object.assign`'s return
 * type inlines the root's local `Props` interface, which `vue-tsc` then rejects as a
 * private name in the default export (TS4082); casting to a declared static keeps the
 * compound fully typed without exporting `Props`. Same shape as the accordion compound.
 */
interface MenuStatic {
  Group: typeof MenuGroup
  Item: typeof MenuItem
  Sub: typeof MenuSub
  SubTrigger: typeof MenuSubTrigger
  SubContent: typeof MenuSubContent
  Back: typeof MenuBack
}

/**
 * Compound API — `Menu.Group`, `Menu.Item`, `Menu.Sub`, … resolve from this one import.
 * `Item` is the existing `menu-item` component, attached unchanged.
 */
const Menu = MenuRoot as typeof MenuRoot & MenuStatic
Menu.Group = MenuGroup
Menu.Item = MenuItem
Menu.Sub = MenuSub
Menu.SubTrigger = MenuSubTrigger
Menu.SubContent = MenuSubContent
Menu.Back = MenuBack

export default Menu

export { MenuBack, MenuGroup, MenuItem, MenuSub, MenuSubContent, MenuSubTrigger }
export type { MenuGroupNode, MenuLevel, MenuNode, MenuSubKind } from './injection-key'
