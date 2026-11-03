// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=395-5596
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/feedback/status-indicator/status-indicator.vue
// component=StatusIndicator
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const severity = instance.getEnum('severity', {
  success: 'success',
  info: 'info',
  neutral: 'neutral',
  warning: 'warning',
  alt: 'alt',
  danger: 'danger'
})
const loading = instance.getEnum('loading', {
  false: false,
  true: true
})

export default {
  example: figma.code`<StatusIndicator${
    severity === 'success'
      ? ''
      : figma.code`
  severity="${severity}"`
  }${
    label === 'Status'
      ? ''
      : figma.code`
  label="${label}"`
  }${
    loading
      ? figma.code`
  loading`
      : ''
  }
/>`,
  imports: ["import StatusIndicator from '@aziontech/webkit/status-indicator'"],
  id: 'status-indicator',
  metadata: { nestable: true }
}
