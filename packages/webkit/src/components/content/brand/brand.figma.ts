// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=587-3946
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/content/brand/brand.vue
// component=Brand
import figma from 'figma'

const instance = figma.selectedInstance

const kind = instance.getEnum('kind', {
  default: 'default',
  reduced: 'reduced',
  extended: 'extended',
  'move-to-the-edge': 'extended'
})

export default {
  example: figma.code`<Brand${kind === 'default' ? '' : figma.code` kind="${kind}"`} />`,
  imports: ["import Brand from '@aziontech/webkit/brand'"],
  id: 'brand',
  metadata: { nestable: true }
}
