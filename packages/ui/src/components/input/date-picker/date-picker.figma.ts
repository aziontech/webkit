// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5087-17541
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/input/date-picker/date-picker.vue
// component=DatePicker
import figma from 'figma'

const instance = figma.selectedInstance

const horizontal = instance.getEnum('horizontal', {
  false: false,
  true: true
})

export default {
  example: figma.code`<DatePicker v-model="date"${horizontal ? figma.code` orientation="horizontal"` : ''} />`,
  imports: ["import DatePicker from '@aziontech/ui/date-picker'"],
  id: 'date-picker',
  metadata: { nestable: true }
}
