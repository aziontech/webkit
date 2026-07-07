import InputGroupRoot from './input-group.vue'
import InputGroupAddon from './input-group-addon/input-group-addon.vue'

interface InputGroupStatic {
  Addon: typeof InputGroupAddon
}

const InputGroup = InputGroupRoot as typeof InputGroupRoot & InputGroupStatic
InputGroup.Addon = InputGroupAddon

export default InputGroup
export { InputGroupAddon }
