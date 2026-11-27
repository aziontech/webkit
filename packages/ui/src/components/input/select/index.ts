import SelectRoot from './select.vue'
import SelectContent from './select-content/select-content.vue'
import SelectGroup from './select-group/select-group.vue'
import SelectItem from './select-item/select-item.vue'
import SelectTrigger from './select-trigger/select-trigger.vue'

interface SelectStatic {
  Trigger: typeof SelectTrigger
  Content: typeof SelectContent
  Group: typeof SelectGroup
  Item: typeof SelectItem
}

const Select = SelectRoot as typeof SelectRoot & SelectStatic
Select.Trigger = SelectTrigger
Select.Content = SelectContent
Select.Group = SelectGroup
Select.Item = SelectItem

export default Select
export { SelectContent, SelectGroup, SelectItem, SelectTrigger }
export type { SelectOptionItem, SelectSize, SelectValue, SelectVariant } from './select.vue'
export type { SelectGroupProps } from './select-group/select-group.vue'
export type { SelectItemProps } from './select-item/select-item.vue'
export type { SelectTriggerProps } from './select-trigger/select-trigger.vue'
