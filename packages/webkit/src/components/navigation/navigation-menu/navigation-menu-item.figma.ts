// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3782-17404
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/navigation-menu/navigation-menu-item.vue
// component=NavigationMenuItem
import figma from 'figma'

const instance = figma.selectedInstance

const showIcon = instance.getBoolean('showIcon')

const titleLayer = instance.findText('Product Name')
const title = titleLayer.type === 'TEXT' ? titleLayer.textContent : ''
const descriptionLayer = instance.findText('Fast applications everywhere')
const description = descriptionLayer.type === 'TEXT' ? descriptionLayer.textContent : ''

export default {
  example: figma.code`<NavigationMenu.Item layout="entry" href="#"${description ? figma.code` description="${description}"` : ''} close-on-click>${
    showIcon
      ? figma.code`
  <template #icon><i class="pi pi-box" aria-hidden="true" /></template>`
      : ''
  }
  ${title}
</NavigationMenu.Item>`,
  imports: ["import NavigationMenu from '@aziontech/webkit/navigation-menu'"],
  id: 'navigation-menu-item',
  metadata: { nestable: true }
}
