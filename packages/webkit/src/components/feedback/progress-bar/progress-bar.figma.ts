// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-870
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/feedback/progress-bar/progress-bar.vue
// component=ProgressBar
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
  example: figma.code`<ProgressBar
  :value="${value}"${
    shape === 'flat'
      ? ''
      : figma.code`
  shape="${shape}"`
  }
/>`,
  imports: ["import ProgressBar from '@aziontech/webkit/progress-bar'"],
  id: 'progress-bar',
  metadata: { nestable: true }
}
