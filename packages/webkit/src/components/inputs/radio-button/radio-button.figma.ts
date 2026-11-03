// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7539
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/radio-button/radio-button.vue
// component=RadioButton
import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('disabled', {
  false: false,
  true: true
})

export default {
  example: figma.code`<RadioButton v-model="selected" value="option"${disabled ? figma.code` disabled` : ''} />`,
  imports: ["import RadioButton from '@aziontech/webkit/radio-button'"],
  id: 'radio-button',
  metadata: { nestable: true }
}
