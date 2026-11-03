// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5087-17541
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/calendar/calendar.vue
// component=Calendar
import figma from 'figma'

const instance = figma.selectedInstance

const period = instance.getEnum('period', {
  false: false,
  true: true
})
const horizontal = instance.getEnum('horizontal', {
  false: false,
  true: true
})

export default {
  example: figma.code`<Calendar v-model="range"${period ? figma.code` period` : ''}${horizontal ? figma.code` horizontal` : ''} />`,
  imports: ["import Calendar from '@aziontech/webkit/calendar'"],
  id: 'calendar',
  metadata: { nestable: true }
}
