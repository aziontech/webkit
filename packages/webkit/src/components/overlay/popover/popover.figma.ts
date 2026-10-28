// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=482-954
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/overlay/popover/popover.vue
// component=Popover
import figma from 'figma'

const instance = figma.selectedInstance

const showHeader = instance.getBoolean('showHeader')
const title = instance.getString('title')
const showDescription = instance.getBoolean('showDescription')
const description = instance.getString('description')
const body = instance.getSlot('slot')
const actions = instance
  .findConnectedInstances((node) => node.name === 'Button')
  .map((button) => button.executeTemplate().example)

export default {
  example: figma.code`<Popover>
  <Popover.Trigger>
    <Button label="Open popover" kind="secondary" />
  </Popover.Trigger>
  <Popover.Content>${
    showHeader
      ? figma.code`
    <Popover.Header>
      <Popover.Title>${title}</Popover.Title>${
        showDescription
          ? figma.code`
      <Popover.Description>${description}</Popover.Description>`
          : ''
      }
      <Popover.Close />
    </Popover.Header>`
      : ''
  }${
    body
      ? figma.code`
    ${body}`
      : ''
  }${
    actions.length > 0
      ? figma.code`
    <Popover.Footer>
      ${actions}
    </Popover.Footer>`
      : ''
  }
  </Popover.Content>
</Popover>`,
  imports: [
    "import Popover from '@aziontech/webkit/popover'",
    "import Button from '@aziontech/webkit/button'"
  ],
  id: 'popover',
  metadata: { nestable: false }
}
