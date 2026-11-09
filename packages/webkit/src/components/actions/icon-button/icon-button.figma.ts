// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3212-2550
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/actions/icon-button/icon-button.vue
// component=IconButton
import figma from 'figma'

const instance = figma.selectedInstance

const kind = instance.getEnum('kind', {
  primary: 'primary',
  secondary: 'secondary',
  outlined: 'outlined',
  transparent: 'transparent',
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
  example: figma.code`<IconButton
  icon="pi pi-check"
  aria-label="Action"${
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
    disabled && !loading
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
  imports: ["import IconButton from '@aziontech/webkit/icon-button'"],
  id: 'icon-button',
  metadata: { nestable: true }
}
