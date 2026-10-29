import BentoGrid from './bento-grid.vue'
import BentoGridCell from './bento-grid-cell/bento-grid-cell.vue'

type CompoundBentoGrid = typeof BentoGrid & {
  Cell: typeof BentoGridCell
}

const BentoGridRoot = Object.assign(BentoGrid, {
  Cell: BentoGridCell
}) as CompoundBentoGrid

export default BentoGridRoot
export { BentoGridCell }
