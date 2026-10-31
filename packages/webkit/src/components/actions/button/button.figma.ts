// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=373-5427
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/actions/button/button.vue
// component=Button
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const showIcon = instance.getBoolean('showIcon')
const kind = instance.getEnum('kind', {
  primary: 'primary',
  secondary: 'secondary',
  outlined: 'outlined',
  text: 'text',
  danger: 'danger'
})
const size = instance.getEnum('size', {
  large: 'large',
  medium: 'medium',
  small: 'small'
})
const disabled = instance.getEnum('disabled', { true: true, false: false })
const loading = instance.getEnum('loading', { true: true, false: false })

export default {
  example: figma.code`<Button
  label="${label}"${
    kind === 'primary'
      ? ''
      : figma.code`
  kind="${kind}"`
  }${
    size === 'large'
      ? ''
      : figma.code`
  size="${size}"`
  }${
    showIcon
      ? figma.code`
  icon="pi pi-plus"`
      : ''
  }${
    disabled
      ? figma.code`
  disabled`
      : ''
  }${
    loading
      ? figma.code`
  loading`
      : ''
  }
/>`,
  imports: ["import Button from '@aziontech/webkit/button'"],
  id: 'button',
  metadata: { nestable: true }
}
