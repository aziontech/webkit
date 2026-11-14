import RadioGroup from './radio-group.vue'
import RadioGroupItem from './radio-group-item/radio-group-item.vue'

export default Object.assign(RadioGroup, {
  Item: RadioGroupItem
})

export { RadioGroupItem }
export type { RadioGroupOrientation } from './injection-key'
