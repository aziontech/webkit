import Popover from './popover.vue'
import PopoverClose from './popover-close/popover-close.vue'
import PopoverContent from './popover-content/popover-content.vue'
import PopoverDescription from './popover-description/popover-description.vue'
import PopoverFooter from './popover-footer/popover-footer.vue'
import PopoverHeader from './popover-header/popover-header.vue'
import PopoverTitle from './popover-title/popover-title.vue'
import PopoverTrigger from './popover-trigger/popover-trigger.vue'

export default Object.assign(Popover, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Footer: PopoverFooter
})

export {
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
}
