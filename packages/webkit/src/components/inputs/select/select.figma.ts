// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3714-10801
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/select/select.vue
// component=Select
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

export default {
  example: figma.code`<Select
  v-model="value"${
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
  }
>${
    iconLeft
      ? figma.code`
  <Select.Trigger>
    <template #iconLeft>
      <i class="pi pi-globe" />
    </template>
  </Select.Trigger>`
      : figma.code`
  <Select.Trigger />`
  }
  <Select.Content>
    <Select.Option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`,
  imports: ["import Select from '@aziontech/webkit/select'"],
  id: 'select',
  metadata: { nestable: true }
}
