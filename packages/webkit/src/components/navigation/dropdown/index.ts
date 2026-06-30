import DropdownRoot from './dropdown.vue'
import DropdownGroup from './dropdown-group/dropdown-group.vue'
import DropdownOption from './dropdown-option/dropdown-option.vue'
import DropdownTrigger from './dropdown-trigger/dropdown-trigger.vue'

interface DropdownStatic {
  Trigger: typeof DropdownTrigger
  Group: typeof DropdownGroup
  Option: typeof DropdownOption
}

const Dropdown = DropdownRoot as typeof DropdownRoot & DropdownStatic
Dropdown.Trigger = DropdownTrigger
Dropdown.Group = DropdownGroup
Dropdown.Option = DropdownOption

export default Dropdown
export { DropdownGroup, DropdownOption, DropdownTrigger }
