// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3782-18192
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/navigation-menu/navigation-menu-root.vue
// component=NavigationMenu
import figma from 'figma'

const instance = figma.selectedInstance

const entries = instance
  .findLayers((node) => node.type === 'INSTANCE' && node.name === 'Button')
  .filter((node) => node.type === 'INSTANCE')
  .map((node) => ({
    label: node.getString('label'),
    submenu: node.getBoolean('showIcon')
  }))

const hasSubmenu = entries.some((entry) => entry.submenu)

const items = entries
  .map((entry) =>
    entry.submenu
      ? `
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>
        ${entry.label}
        <NavigationMenu.Icon><i class="pi pi-chevron-down" aria-hidden="true" /></NavigationMenu.Icon>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content />
    </NavigationMenu.Item>`
      : `
    <NavigationMenu.Item>
      <NavigationMenu.Trigger href="#">${entry.label}</NavigationMenu.Trigger>
    </NavigationMenu.Item>`
  )
  .join('')

const viewport = hasSubmenu
  ? `
  <NavigationMenu.Portal>
    <NavigationMenu.Positioner>
      <NavigationMenu.Popup>
        <NavigationMenu.Viewport />
      </NavigationMenu.Popup>
    </NavigationMenu.Positioner>
  </NavigationMenu.Portal>`
  : ''

export default {
  example: figma.code`<NavigationMenu>
  <NavigationMenu.List>${items}
  </NavigationMenu.List>${viewport}
</NavigationMenu>`,
  imports: ["import NavigationMenu from '@aziontech/webkit/navigation-menu'"],
  id: 'navigation-menu',
  metadata: { nestable: true }
}
