// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=480-889
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/content/accordion/accordion.vue
// component=Accordion
import figma from 'figma'

const instance = figma.selectedInstance

const items = instance.getSlot('accordions')
const firstTab = instance.findInstance('AccordionTab')
const hasTab = firstTab.type === 'INSTANCE'
const size = hasTab
  ? firstTab.getEnum('size', {
      medium: 'medium',
      large: 'large'
    })
  : 'medium'
const iconPosition = hasTab
  ? firstTab.getEnum('arrowPosition', {
      right: 'trailing',
      left: 'leading'
    })
  : 'trailing'

export default {
  example: figma.code`<Accordion${size === 'medium' ? '' : figma.code` size="${size}"`}${iconPosition === 'trailing' ? '' : figma.code` icon-position="${iconPosition}"`}>
  ${items}
</Accordion>`,
  imports: ["import Accordion from '@aziontech/ui/accordion'"],
  id: 'accordion',
  metadata: { nestable: true }
}
