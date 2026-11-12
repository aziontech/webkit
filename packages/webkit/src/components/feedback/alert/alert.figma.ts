// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=478-892
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/feedback/alert/alert.vue
// component=Alert
import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.getString('title')
const description = instance.getString('description')
const severity = instance.getEnum('severity', {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger'
})
const showAction = instance.getBoolean('showAction')
const closable = instance.getBoolean('closable')
const action = instance.findInstance('Button')
const actionLabel = showAction && action.type === 'INSTANCE' ? action.getString('label') : ''

export default {
  example: figma.code`<Alert${
    severity === 'info'
      ? ''
      : figma.code`
  severity="${severity}"`
  }${
    actionLabel
      ? figma.code`
  action-label="${actionLabel}"`
      : ''
  }${
    closable
      ? figma.code`
  closable`
      : ''
  }
>
  <strong>${title}</strong> ${description}
</Alert>`,
  imports: ["import Alert from '@aziontech/webkit/alert'"],
  id: 'message',
  metadata: { nestable: true }
}
