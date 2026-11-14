import InputGroupRoot from './input-group.vue'
import InputGroupAddon from './input-group-addon/input-group-addon.vue'
import InputGroupInput from './input-group-input/input-group-input.vue'

const InputGroup = Object.assign(InputGroupRoot, {
  Addon: InputGroupAddon,
  Input: InputGroupInput
})

export default InputGroup
export { InputGroupAddon, InputGroupInput }
export type { InputGroupSize } from './input-group.vue'
export type { InputGroupInputType } from './input-group-input/input-group-input.vue'
