// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2904-5892
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/actions/toggle-group/toggle-group.vue
// component=ToggleGroup
import figma from 'figma'

const instance = figma.selectedInstance

const labels = instance
  .findLayers((node) => node.type === 'TEXT' && node.name === 'label', { traverseInstances: true })
  .map((node) => (node.type === 'TEXT' ? node.textContent : ''))
  .filter((text) => text.length > 0)
const options = labels
  .map((text) => `{ label: '${text}', value: '${text.toLowerCase().replace(/\s+/g, '-')}' }`)
  .join(', ')

export default {
  example: figma.code`<ToggleGroup
  v-model="value"
  :options="[${options}]"
/>`,
  imports: ["import ToggleGroup from '@aziontech/webkit/toggle-group'"],
  id: 'toggle-group',
  metadata: { nestable: true }
}
