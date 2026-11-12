import InputGroupRoot from './input-group.vue'
import InputGroupAddon from './input-group-addon/input-group-addon.vue'
import InputGroupInput from './input-group-input/input-group-input.vue'

interface InputGroupStatic {
  Addon: typeof InputGroupAddon
  Input: typeof InputGroupInput
}

const InputGroup = InputGroupRoot as typeof InputGroupRoot & InputGroupStatic
InputGroup.Addon = InputGroupAddon
InputGroup.Input = InputGroupInput

export default InputGroup
export { InputGroupAddon, InputGroupInput }
export type { InputGroupSize } from './input-group.vue'
