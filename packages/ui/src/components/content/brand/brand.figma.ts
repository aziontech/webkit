// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=587-3946
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/content/brand/brand.vue
// component=Brand
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('kind', {
  default: 'default',
  reduced: 'reduced',
  extended: 'extended'
})

export default {
  example: figma.code`<Brand${variant === 'default' ? '' : figma.code` variant="${variant}"`} />`,
  imports: ["import Brand from '@aziontech/ui/brand'"],
  id: 'brand',
  metadata: { nestable: true }
}
