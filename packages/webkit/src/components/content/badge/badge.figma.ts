// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-909
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/content/badge/badge.vue
// component=Badge
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const severity = instance.getEnum('severity', {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  default: 'default'
})
const size = instance.getEnum('size', {
  small: 'small',
  medium: 'medium',
  large: 'large'
})

export default {
  example: figma.code`<Badge
  label="${label}"${
    severity === 'primary'
      ? ''
      : figma.code`
  severity="${severity}"`
  }${
    size === 'medium'
      ? ''
      : figma.code`
  size="${size}"`
  }
/>`,
  imports: ["import Badge from '@aziontech/webkit/badge'"],
  id: 'badge',
  metadata: { nestable: true }
}
