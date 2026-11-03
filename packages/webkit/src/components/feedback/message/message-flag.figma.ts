// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2808-5163
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/feedback/message/message.vue
// component=Message
import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.getString('label')
const severity = instance.getEnum('severity', {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error'
})

export default {
  example: figma.code`<Message${
    severity === 'info'
      ? ''
      : figma.code`
  severity="${severity}"`
  }
  size="small"
  label="${title}"
/>`,
  imports: ["import Message from '@aziontech/webkit/message'"],
  id: 'message-flag',
  metadata: { nestable: true }
}
