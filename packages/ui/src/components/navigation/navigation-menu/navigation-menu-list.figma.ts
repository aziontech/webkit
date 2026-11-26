// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3782-17415
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/navigation-menu/navigation-menu-list.vue
// component=NavigationMenuList
import figma from 'figma'

const instance = figma.selectedInstance

const labelLayer = instance.findText('Categorie Name')
const label = labelLayer.type === 'TEXT' ? labelLayer.textContent : ''

const items = instance
  .findConnectedInstances((node) => node.codeConnectId() === 'navigation-menu-item')
  .reduce(
    (code, node) =>
      node.type === 'INSTANCE'
        ? figma.code`${code}
  ${node.executeTemplate().example}`
        : code,
    ''
  )

export default {
  example: figma.code`<NavigationMenu.List${label ? figma.code` label="${label}"` : ''}>${items}
</NavigationMenu.List>`,
  imports: ["import NavigationMenu from '@aziontech/webkit/navigation-menu'"],
  id: 'navigation-menu-list',
  metadata: { nestable: true }
}
