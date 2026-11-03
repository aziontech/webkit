// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5546-79300
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/content/item/item.vue
// component=Item
import figma from 'figma'

const instance = figma.selectedInstance

const kind = instance.getEnum('kind', {
  inline: 'inline',
  default: 'default',
  outline: 'outline',
  muted: 'muted'
})
const size = instance.getEnum('size', {
  medium: 'medium',
  small: 'small'
})
const asChild = instance.getEnum('asChild', {
  false: false,
  true: true
})
const showLeft = instance.getBoolean('showSlotLeft')
const showRight = instance.getBoolean('showSlotRight')
const media = instance.getSlot('slotLeft')
const actions = instance.getSlot('slotRight')

const titleNode = instance.findText('ItemTitle')
const title = titleNode.type === 'TEXT' ? titleNode.textContent : 'Basic Item'
const descriptionNode = instance.findText('ItemDescription')
const hasDescription = descriptionNode.type === 'TEXT'
const description = hasDescription ? descriptionNode.textContent : ''

export default {
  example: figma.code`<Item${kind === 'default' ? '' : figma.code` kind="${kind}"`}${size === 'medium' ? '' : figma.code` size="${size}"`}${asChild ? figma.code` as-child` : ''}>${
    showLeft
      ? figma.code`
  <Item.Media kind="icon">
    ${media}
  </Item.Media>`
      : ''
  }
  <Item.Content>
    <Item.Title>${title}</Item.Title>${
      hasDescription
        ? figma.code`
    <Item.Description>${description}</Item.Description>`
        : ''
    }
  </Item.Content>${
    showRight
      ? figma.code`
  <Item.Actions>
    ${actions}
  </Item.Actions>`
      : ''
  }
</Item>`,
  imports: ["import Item from '@aziontech/webkit/item'"],
  id: 'item',
  metadata: { nestable: true }
}
