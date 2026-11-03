// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4313-20500
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/actions/button-highlight/button-highlight.vue
// component=ButtonHighlight
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const showIcon = instance.getBoolean('showIcon')
const size = instance.getEnum('size', {
  large: 'large',
  medium: 'medium',
  small: 'small'
})
const disabled = instance.getEnum('disabled', { true: true, false: false })

export default {
  example: figma.code`<ButtonHighlight
  label="${label}"${
    size === 'large'
      ? ''
      : figma.code`
  size="${size}"`
  }${
    showIcon
      ? figma.code`
  icon="pi pi-sparkles"`
      : ''
  }${
    disabled
      ? figma.code`
  disabled`
      : ''
  }
/>`,
  imports: ["import ButtonHighlight from '@aziontech/webkit/button-highlight'"],
  id: 'button-highlight',
  metadata: { nestable: true }
}
