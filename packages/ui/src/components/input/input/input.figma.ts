// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=562-6774
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/input/input/input.vue
// component=Input
import figma from 'figma'

const instance = figma.selectedInstance

const placeholder = instance.getString('placeholder')
const size = instance.getEnum('size', {
  small: 'small',
  medium: 'medium',
  large: 'large'
})
const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})
const required = instance.getEnum('required', {
  false: false,
  true: true
})
const invalid = instance.getEnum('invalid', {
  false: false,
  true: true
})
const iconLeft = instance.getBoolean('hasIconLeft')
const iconRight = instance.getBoolean('hasIconRight')

const attrs = figma.code`v-model="value"${
  placeholder
    ? figma.code`
  placeholder="${placeholder}"`
    : ''
}${
  size === 'medium'
    ? ''
    : figma.code`
  size="${size}"`
}${
  required
    ? figma.code`
  required`
    : ''
}${
  invalid
    ? figma.code`
  invalid`
    : ''
}${
  disabled
    ? figma.code`
  disabled`
    : ''
}`

export default {
  example:
    iconLeft || iconRight
      ? figma.code`<Input
  ${attrs}
>${
          iconLeft
            ? figma.code`
  <template #leading>
    <i class="az az-globe" />
  </template>`
            : ''
        }${
          iconRight
            ? figma.code`
  <template #trailing>
    <i class="az az-search" />
  </template>`
            : ''
        }
</Input>`
      : figma.code`<Input
  ${attrs}
/>`,
  imports: ["import Input from '@aziontech/ui/input'"],
  id: 'input',
  metadata: { nestable: true }
}
