import CardGrid from './card-grid.vue'
import CardGridCell from './card-grid-cell/card-grid-cell.vue'

type CompoundCardGrid = typeof CardGrid & {
  Cell: typeof CardGridCell
}

const CardGridRoot = Object.assign(CardGrid, {
  Cell: CardGridCell
}) as CompoundCardGrid

export default CardGridRoot
export { CardGridCell }
