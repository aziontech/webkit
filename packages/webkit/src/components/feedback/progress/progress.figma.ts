// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-870
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/feedback/progress/progress.vue
// component=Progress
import figma from 'figma'

const instance = figma.selectedInstance

const value = instance.getEnum('type', {
  determinate: 50,
  complete: 100
})
const shape = instance.getEnum('shape', {
  rounded: 'rounded',
  flat: 'flat'
})

export default {
  example: figma.code`<Progress
  :value="${value}"${
    shape === 'flat'
      ? ''
      : figma.code`
  shape="${shape}"`
  }
/>`,
  imports: ["import Progress from '@aziontech/webkit/progress'"],
  id: 'progress',
  metadata: { nestable: true }
}
