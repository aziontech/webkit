import CardGrid from './card-grid.vue'
import CardGridCell from './card-grid-cell/card-grid-cell.vue'

// Compound API (see .claude/rules/compound-api.md). The explicit CompoundCardGrid
// annotation makes declaration emit reference the sub-component types instead
// of expanding the root's private Props.
type CompoundCardGrid = typeof CardGrid & {
  Cell: typeof CardGridCell
}

const CardGridRoot = Object.assign(CardGrid, {
  Cell: CardGridCell
}) as CompoundCardGrid

export default CardGridRoot
export { CardGridCell }
