// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=478-938
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/feedback/toast/toaster.vue
// component=Toast
import figma from 'figma'

const instance = figma.selectedInstance

const severity = instance.getEnum('type', {
  info: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
  default: 'default'
})
const loading = instance.getEnum('loading', {
  false: false,
  true: true
})
const type = loading ? 'loading' : severity
const showAction = instance.getBoolean('showAction')
const showClose = instance.getBoolean('showClose')

const title = instance.findText(loading ? 'Loading...' : 'Event has been created')
const description = instance.findText('Sunday, December 03, 2023 at 9:00 AM')
const item = loading ? undefined : instance.getSlot('item')
const action = instance.findInstance('Button')
const actionLabel = showAction && action.type === 'INSTANCE' ? action.getString('label') : ''

const body =
  title.type === 'TEXT'
    ? figma.code`
  <Toast.Title>${title.textContent}</Toast.Title>${
    description.type === 'TEXT'
      ? figma.code`
  <Toast.Description>${description.textContent}</Toast.Description>`
      : ''
  }`
    : figma.code`
  ${item}`

const trailing =
  actionLabel || showClose
    ? figma.code`
  <template #trailing>${
    actionLabel
      ? figma.code`
    <Toast.Action label="${actionLabel}" />`
      : ''
  }${
    showClose
      ? figma.code`
    <Toast.Close />`
      : ''
  }
  </template>`
    : ''

export default {
  example: figma.code`<Toast.Item${type === 'default' ? '' : figma.code` type="${type}"`}>${body}${trailing}
</Toast.Item>`,
  imports: ["import Toast from '@aziontech/webkit/toast'"],
  id: 'toast',
  metadata: { nestable: true }
}
