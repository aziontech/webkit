import DatePicker from './date-picker.vue'
import DatePickerClear from './date-picker-clear/date-picker-clear.vue'

export default Object.assign(DatePicker, {
  Clear: DatePickerClear
})

export type { DatePickerProps } from './date-picker.vue'
export type {
  DatePickerMonth,
  DatePickerOrientation,
  DatePickerSize,
  DatePickerValue
} from './injection-key'
