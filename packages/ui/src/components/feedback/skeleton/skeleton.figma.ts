// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-881
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/feedback/skeleton/skeleton.vue
// component=Skeleton
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('kind', {
  shape: 'rectangle',
  circle: 'circle'
})

export default {
  example:
    variant === 'circle'
      ? figma.code`<Skeleton
  variant="circle"
  width="40px"
  height="40px"
/>`
      : figma.code`<Skeleton />`,
  imports: ["import Skeleton from '@aziontech/ui/skeleton'"],
  id: 'skeleton',
  metadata: { nestable: true }
}
