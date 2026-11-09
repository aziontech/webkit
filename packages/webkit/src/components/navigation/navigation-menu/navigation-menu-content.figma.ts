// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3782-17375
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/navigation-menu/navigation-menu-content.vue
// component=NavigationMenuContent
import figma from 'figma'

const instance = figma.selectedInstance

const lists = instance
  .findConnectedInstances((node) => node.codeConnectId() === 'navigation-menu-list')
  .reduce(
    (code, node) =>
      node.type === 'INSTANCE'
        ? figma.code`${code}
  ${node.executeTemplate().example}`
        : code,
    ''
  )

export default {
  example: figma.code`<NavigationMenu.Content>${lists}
</NavigationMenu.Content>`,
  imports: ["import NavigationMenu from '@aziontech/webkit/navigation-menu'"],
  id: 'navigation-menu-content',
  metadata: { nestable: true }
}
