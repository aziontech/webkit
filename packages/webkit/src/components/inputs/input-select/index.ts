import InputSelectRoot from './input-select.vue'
import InputSelectContent from './input-select-content/input-select-content.vue'
import InputSelectGroup from './input-select-group/input-select-group.vue'
import InputSelectOption from './input-select-option/input-select-option.vue'
import InputSelectTrigger from './input-select-trigger/input-select-trigger.vue'

interface InputSelectStatic {
  Trigger: typeof InputSelectTrigger
  Content: typeof InputSelectContent
  Group: typeof InputSelectGroup
  Option: typeof InputSelectOption
}

const InputSelect = InputSelectRoot as typeof InputSelectRoot & InputSelectStatic
InputSelect.Trigger = InputSelectTrigger
InputSelect.Content = InputSelectContent
InputSelect.Group = InputSelectGroup
InputSelect.Option = InputSelectOption

export default InputSelect
export { InputSelectContent, InputSelectGroup, InputSelectOption, InputSelectTrigger }
