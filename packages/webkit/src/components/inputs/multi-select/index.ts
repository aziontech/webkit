import MultiSelectRoot from './multi-select.vue'
import MultiSelectContent from './multi-select-content/multi-select-content.vue'
import MultiSelectGroup from './multi-select-group/multi-select-group.vue'
import MultiSelectItem from './multi-select-item/multi-select-item.vue'
import MultiSelectTrigger from './multi-select-trigger/multi-select-trigger.vue'

interface MultiSelectStatic {
  Trigger: typeof MultiSelectTrigger
  Content: typeof MultiSelectContent
  Group: typeof MultiSelectGroup
  Item: typeof MultiSelectItem
}

const MultiSelect = MultiSelectRoot as typeof MultiSelectRoot & MultiSelectStatic
MultiSelect.Trigger = MultiSelectTrigger
MultiSelect.Content = MultiSelectContent
MultiSelect.Group = MultiSelectGroup
MultiSelect.Item = MultiSelectItem

export default MultiSelect
export { MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger }
export type { MultiSelectSize, MultiSelectVariant } from './injection-key'
export type { MultiSelectGroupProps } from './multi-select-group/multi-select-group.vue'
export type { MultiSelectItemProps } from './multi-select-item/multi-select-item.vue'
