// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2109-5848
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/box-grid-selection/box-grid-selection.vue
// component=BoxGridSelection
import figma from 'figma'

export default {
  example: figma.code`<BoxGridSelection v-model="selected" :items="items" />`,
  imports: ["import BoxGridSelection from '@aziontech/webkit/box-grid-selection'"],
  id: 'box-grid-selection',
  metadata: { nestable: true }
}
