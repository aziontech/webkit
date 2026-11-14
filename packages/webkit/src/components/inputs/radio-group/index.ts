import RadioGroup from './radio-group.vue'
import RadioGroupItem from './radio-group-item/radio-group-item.vue'

export default Object.assign(RadioGroup, {
  Item: RadioGroupItem
})

export { RadioGroupItem }
export type { RadioGroupOrientation } from './injection-key'
export type { RadioGroupProps } from './radio-group.vue'
export type { RadioGroupItemProps } from './radio-group-item/radio-group-item.vue'
