// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2904-5892
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/actions/segmented-button/segmented-button.vue
// component=SegmentedButton
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
  example: figma.code`<SegmentedButton
  v-model="value"
  :options="[${options}]"
/>`,
  imports: ["import SegmentedButton from '@aziontech/webkit/segmented-button'"],
  id: 'segmented-button',
  metadata: { nestable: true }
}
