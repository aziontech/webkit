// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=480-876
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/content/accordion/accordion-item/accordion-item.vue
// component=AccordionItem
import figma from 'figma'

const instance = figma.selectedInstance

const header = instance.getSlot('header')
const content = instance.getSlot('content')

export default {
  example: figma.code`<Accordion.Item value="item-1">
  <Accordion.Trigger>
    ${header}
  </Accordion.Trigger>
  <Accordion.Content>
    ${content}
  </Accordion.Content>
</Accordion.Item>`,
  imports: ["import Accordion from '@aziontech/webkit/accordion'"],
  id: 'accordion-item',
  metadata: { nestable: true }
}
