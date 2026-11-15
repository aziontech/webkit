import RadioGroup from './radio-group.vue'
import RadioGroupItem from './radio-group-item/radio-group-item.vue'

export default Object.assign(RadioGroup, {
  Item: RadioGroupItem
})

export { RadioGroupItem }
export type {
  RadioGroupOption,
  RadioGroupOrientation,
  RadioGroupProps,
  RadioGroupVariant
} from './injection-key'
export type { RadioGroupItemProps } from './radio-group-item/radio-group-item.vue'
