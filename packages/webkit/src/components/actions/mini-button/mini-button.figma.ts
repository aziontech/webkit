// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3211-220
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/actions/mini-button/mini-button.vue
// component=MiniButton
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const showIcon = instance.getBoolean('showIcon')
const size = instance.getEnum('size', {
  large: 'large',
  medium: 'medium'
})

export default {
  example: figma.code`<MiniButton${
    label === 'Learn More'
      ? ''
      : figma.code`
  label="${label}"`
  }${
    size === 'large'
      ? ''
      : figma.code`
  size="${size}"`
  }${
    showIcon
      ? ''
      : figma.code`
  :show-icon="false"`
  }
  href="#"
/>`,
  imports: ["import MiniButton from '@aziontech/webkit/mini-button'"],
  id: 'mini-button',
  metadata: { nestable: true }
}
