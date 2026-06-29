import MultiSelectRoot from './multi-select.vue'
import MultiSelectContent from './multi-select-content/multi-select-content.vue'
import MultiSelectGroup from './multi-select-group/multi-select-group.vue'
import MultiSelectOption from './multi-select-option/multi-select-option.vue'
import MultiSelectTrigger from './multi-select-trigger/multi-select-trigger.vue'

interface MultiSelectStatic {
  Trigger: typeof MultiSelectTrigger
  Content: typeof MultiSelectContent
  Group: typeof MultiSelectGroup
  Option: typeof MultiSelectOption
}

const MultiSelect = MultiSelectRoot as typeof MultiSelectRoot & MultiSelectStatic
MultiSelect.Trigger = MultiSelectTrigger
MultiSelect.Content = MultiSelectContent
MultiSelect.Group = MultiSelectGroup
MultiSelect.Option = MultiSelectOption

export default MultiSelect
export { MultiSelectContent, MultiSelectGroup, MultiSelectOption, MultiSelectTrigger }
