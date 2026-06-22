import InputSelectRoot from './input-select.vue'
import InputSelectContent from './input-select-content/input-select-content.vue'
import InputSelectGroup from './input-select-group/input-select-group.vue'
import InputSelectOption from './input-select-option/input-select-option.vue'
import InputSelectTrigger from './input-select-trigger/input-select-trigger.vue'

const InputSelect = Object.assign(InputSelectRoot, {
  Trigger: InputSelectTrigger,
  Content: InputSelectContent,
  Group: InputSelectGroup,
  Option: InputSelectOption
})

export default InputSelect
export { InputSelectContent, InputSelectGroup, InputSelectOption, InputSelectTrigger }
