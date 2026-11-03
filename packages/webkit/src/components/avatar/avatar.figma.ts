// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=477-882
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/avatar/avatar.vue
// component=Avatar
import figma from 'figma'

const instance = figma.selectedInstance

const kind = instance.getEnum('kind', {
  circle: 'circle',
  square: 'square'
})
const size = instance.getEnum('size', {
  small: 'small',
  medium: 'medium',
  large: 'large',
  xl: 'large'
})
const type = instance.getEnum('type', {
  text: 'text',
  icon: 'icon',
  image: 'image'
})
const initials = instance.findText('AB')
const label = initials.type === 'TEXT' ? initials.textContent : 'AB'

export default {
  example: figma.code`<Avatar${
    type === 'text'
      ? figma.code`
  label="${label}"`
      : ''
  }${
    type === 'image'
      ? figma.code`
  src="https://example.com/avatar.png"
  alt="User avatar"`
      : ''
  }${
    kind === 'circle'
      ? ''
      : figma.code`
  kind="${kind}"`
  }${
    size === 'medium'
      ? ''
      : figma.code`
  size="${size}"`
  }
/>`,
  imports: ["import Avatar from '@aziontech/webkit/avatar'"],
  id: 'avatar',
  metadata: { nestable: true }
}
