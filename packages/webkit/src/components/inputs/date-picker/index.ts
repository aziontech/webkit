import DatePicker from './date-picker.vue'
import DatePickerClear from './date-picker-clear/date-picker-clear.vue'

type CompoundDatePicker = typeof DatePicker & {
  Clear: typeof DatePickerClear
}

const DatePickerRoot = Object.assign(DatePicker, {
  Clear: DatePickerClear
}) as CompoundDatePicker

export default DatePickerRoot

export type { DatePickerProps } from './date-picker.vue'
export type {
  DatePickerMonth,
  DatePickerOrientation,
  DatePickerSize,
  DatePickerValue
} from './injection-key'
