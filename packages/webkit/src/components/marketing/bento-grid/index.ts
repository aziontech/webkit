import BentoGrid from './bento-grid.vue'
import BentoGridCell from './bento-grid-cell/bento-grid-cell.vue'

// Compound API (see .claude/rules/compound-api.md). The explicit CompoundBentoGrid
// annotation makes declaration emit reference the sub-component types instead
// of expanding the root's private Props.
type CompoundBentoGrid = typeof BentoGrid & {
  Cell: typeof BentoGridCell
}

const BentoGridRoot = Object.assign(BentoGrid, {
  Cell: BentoGridCell
}) as CompoundBentoGrid

export default BentoGridRoot
export { BentoGridCell }
