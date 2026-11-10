// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2109-5848
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/radio-cards/radio-cards.vue
// component=RadioCards
import figma from 'figma'

export default {
  example: figma.code`<RadioCards v-model="selected" :items="items" />`,
  imports: ["import RadioCards from '@aziontech/webkit/radio-cards'"],
  id: 'radio-cards',
  metadata: { nestable: true }
}
