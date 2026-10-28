// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-940
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/tag/tag.vue
// component=Tag
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const severity = instance.getEnum('severity', {
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  secondary: 'secondary',
  accent: 'accent',
  info: 'info',
  contrast: 'contrast'
})
const rounded = instance.getEnum('rounded', {
  false: false,
  true: true
})
const size = instance.getEnum('size', {
  medium: 'medium',
  small: 'small'
})
const showIcon = instance.getBoolean('showIcon')

export default {
  example: figma.code`<Tag
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
  }${
    rounded
      ? figma.code`
  rounded`
      : ''
  }${
    showIcon
      ? figma.code`
  icon="pi pi-box"`
      : ''
  }
/>`,
  imports: ["import Tag from '@aziontech/webkit/tag'"],
  id: 'tag',
  metadata: { nestable: true }
}
