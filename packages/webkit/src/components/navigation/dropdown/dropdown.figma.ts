// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3775-16746
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/dropdown/dropdown.vue
// component=Dropdown
import figma from 'figma'

const instance = figma.selectedInstance

const showTop = instance.getBoolean('showSlotTop')
const showBottom = instance.getBoolean('showSlotBottom')
const top = instance.getSlot('slotTop')
const bottom = instance.getSlot('slotBottom')

const groups = instance
  .findConnectedInstances((node) => node.codeConnectId() === 'dropdown-group')
  .reduce(
    (code, node) =>
      node.type === 'INSTANCE'
        ? figma.code`${code}
  ${node.executeTemplate().example}`
        : code,
    ''
  )

export default {
  example: figma.code`<Dropdown>
  <Dropdown.Trigger>
    <IconButton kind="outlined" icon="pi pi-ellipsis-h" aria-label="Open menu" />
  </Dropdown.Trigger>${
    showTop
      ? figma.code`
  <template #top>${top}</template>`
      : ''
  }${groups}${
    showBottom
      ? figma.code`
  <template #bottom>${bottom}</template>`
      : ''
  }
</Dropdown>`,
  imports: [
    "import Dropdown from '@aziontech/webkit/dropdown'",
    "import IconButton from '@aziontech/webkit/icon-button'"
  ],
  id: 'dropdown',
  metadata: { nestable: true }
}
