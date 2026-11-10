// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3750-15645
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue
// component=DropdownMenuGroup
import figma from 'figma'

const instance = figma.selectedInstance

const showTop = instance.getBoolean('showSlotTop')
const showBottom = instance.getBoolean('showSlotBottom')
const top = instance.getSlot('slotTop')
const bottom = instance.getSlot('slotBottom')

const rows = instance
  .findConnectedInstances((node) => node.codeConnectId() === 'dropdown-menu-option')
  .filter((node) => node.type === 'INSTANCE')

const header = rows.find((node) => node.getPropertyValue('type') === 'Group')
const label = header ? header.getString('groupLabel') : ''

const options = rows
  .filter((node) => node.getPropertyValue('type') === 'Option')
  .reduce(
    (code, node) => figma.code`${code}
  ${node.executeTemplate().example}`,
    ''
  )

export default {
  example: figma.code`<DropdownMenu.Group${label ? figma.code` label="${label}"` : ''}>${
    showTop
      ? figma.code`
  <template #top>${top}</template>`
      : ''
  }${options}${
    showBottom
      ? figma.code`
  <template #bottom>${bottom}</template>`
      : ''
  }
</DropdownMenu.Group>`,
  imports: ["import DropdownMenu from '@aziontech/webkit/dropdown-menu'"],
  id: 'dropdown-menu-group',
  metadata: { nestable: true }
}
