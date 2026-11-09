// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10802
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/input-group/input-group.vue
// component=InputGroup
import figma from 'figma'

const instance = figma.selectedInstance

const invalid = instance.getEnum('invalid', {
  false: false,
  true: true
})
const required = instance.getEnum('required', {
  false: false,
  true: true
})
const showLeft = instance.getBoolean('showSlotLeft')
const showRight = instance.getBoolean('showSlotRight')
const left = instance.getSlot('slotLeft')
const middle = instance.getSlot('slotMiddle')
const right = instance.getSlot('slotRight')

export default {
  example: figma.code`<InputGroup${invalid ? figma.code` invalid` : ''}${required ? figma.code` required` : ''}>${
    showLeft && left
      ? figma.code`
  <InputGroup.Addon>${left}</InputGroup.Addon>`
      : ''
  }${
    middle
      ? figma.code`
  ${middle}`
      : ''
  }${
    showRight && right
      ? figma.code`
  <InputGroup.Addon>${right}</InputGroup.Addon>`
      : ''
  }
</InputGroup>`,
  imports: ["import InputGroup from '@aziontech/webkit/input-group'"],
  id: 'input-group',
  metadata: { nestable: true }
}
