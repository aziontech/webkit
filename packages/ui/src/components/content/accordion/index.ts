import AccordionRoot from './accordion.vue'
import AccordionContent from './accordion-content/accordion-content.vue'
import AccordionItem from './accordion-item/accordion-item.vue'
import AccordionTrigger from './accordion-trigger/accordion-trigger.vue'

interface AccordionStatic {
  Item: typeof AccordionItem
  Trigger: typeof AccordionTrigger
  Content: typeof AccordionContent
}

const Accordion = AccordionRoot as typeof AccordionRoot & AccordionStatic
Accordion.Item = AccordionItem
Accordion.Trigger = AccordionTrigger
Accordion.Content = AccordionContent

export default Accordion
export { AccordionContent, AccordionItem, AccordionTrigger }
export type { AccordionValue } from './accordion.vue'
export type { AccordionProps } from './accordion.vue'
export type { AccordionContentProps } from './accordion-content/accordion-content.vue'
export type { AccordionItemProps } from './accordion-item/accordion-item.vue'
export type { AccordionTriggerProps } from './accordion-trigger/accordion-trigger.vue'
export type { AccordionIconPosition, AccordionSize, AccordionType } from './injection-key'
