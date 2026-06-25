import SelectRoot from './select.vue'
import SelectContent from './select-content/select-content.vue'
import SelectGroup from './select-group/select-group.vue'
import SelectOption from './select-option/select-option.vue'
import SelectTrigger from './select-trigger/select-trigger.vue'

interface SelectStatic {
  Trigger: typeof SelectTrigger
  Content: typeof SelectContent
  Group: typeof SelectGroup
  Option: typeof SelectOption
}

const Select = SelectRoot as typeof SelectRoot & SelectStatic
Select.Trigger = SelectTrigger
Select.Content = SelectContent
Select.Group = SelectGroup
Select.Option = SelectOption

export default Select
export { SelectContent, SelectGroup, SelectOption, SelectTrigger }
