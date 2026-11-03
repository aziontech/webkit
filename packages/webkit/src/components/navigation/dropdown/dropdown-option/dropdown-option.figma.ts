// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3750-15346
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/dropdown/dropdown-option/dropdown-option.vue
// component=DropdownOption
import figma from 'figma'

const instance = figma.selectedInstance

const type = instance.getEnum('type', {
  group: 'group',
  option: 'option',
  separator: 'separator'
})
const selected = instance.getEnum('selected', {
  false: false,
  true: true
})
const disabled = instance.getEnum('disabled', {
  true: true,
  false: false
})
const label = instance.getString('label')
const groupLabel = instance.getString('groupLabel')
const showCommand = instance.getBoolean('showCommand')
const command = instance.getString('command')
const showIcon = instance.getBoolean('iconLeft')
const showRight = instance.getBoolean('slotRight')
const right = instance.getSlot('slot')

const value = label
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const attrs = figma.code` value="${value || 'option'}" label="${label}"${showCommand && !showRight ? figma.code` command="${command}"` : ''}${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`

const option =
  showIcon || showRight
    ? figma.code`<Dropdown.Option${attrs}>${
        showIcon
          ? figma.code`
  <template #left><i class="pi pi-box" aria-hidden="true" /></template>`
          : ''
      }${
        showRight
          ? figma.code`
  <template #right>${right}</template>`
          : ''
      }
</Dropdown.Option>`
    : figma.code`<Dropdown.Option${attrs} />`

let example = option
if (type === 'group') example = figma.code`<Dropdown.Group label="${groupLabel}" />`
if (type === 'separator') example = figma.code``

export default {
  example,
  imports: ["import Dropdown from '@aziontech/webkit/dropdown'"],
  id: 'dropdown-option',
  metadata: { nestable: true }
}
