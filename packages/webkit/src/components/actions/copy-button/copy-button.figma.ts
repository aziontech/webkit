// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=403-882
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/actions/copy-button/copy-button.vue
// component=CopyButton
import figma from 'figma'

const instance = figma.selectedInstance

const outlined = instance.getEnum('kind', { outlined: true, transparent: false })
const disabled = instance.getEnum('state', {
  default: false,
  disabled: true,
  copied: false
})

export default {
  example: figma.code`<CopyButton
  :value="textToCopy"${
    outlined
      ? figma.code`
  kind="outlined"`
      : ''
  }${
    disabled
      ? figma.code`
  disabled`
      : ''
  }
/>`,
  imports: ["import CopyButton from '@aziontech/webkit/copy-button'"],
  id: 'copy-button',
  metadata: { nestable: true }
}
