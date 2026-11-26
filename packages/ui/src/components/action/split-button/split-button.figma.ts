// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=477-957
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/action/split-button/split-button.vue
// component=SplitButton
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('kind', {
  primary: 'primary',
  secondary: 'secondary',
  outlined: 'outline'
})
const size = instance.getEnum('size', {
  large: 'large',
  medium: 'medium',
  small: 'small'
})
const command = instance.findInstance('Button')
const label = command.type === 'INSTANCE' ? command.getString('label') : 'Label'
const showIcon = command.type === 'INSTANCE' ? command.getBoolean('showIcon') : false

export default {
  example: figma.code`<SplitButton
  label="${label}"${
    showIcon
      ? figma.code`
  icon="az az-plus"`
      : ''
  }${
    variant === 'primary'
      ? ''
      : figma.code`
  variant="${variant}"`
  }${
    size === 'large'
      ? ''
      : figma.code`
  size="${size}"`
  }
  :model="items"
/>`,
  imports: ["import SplitButton from '@aziontech/webkit/split-button'"],
  id: 'split-button',
  metadata: { nestable: true }
}
