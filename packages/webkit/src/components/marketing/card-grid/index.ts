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
export type {
  CardGridColumns,
  CardGridDividerColor,
  CardGridLayout,
  CardGridMobileColumns,
  CardGridVariant
} from './card-grid.vue'
export type { CardGridProps } from './card-grid.vue'
export type { CardGridCellVariant } from './card-grid-cell/card-grid-cell.vue'
export type { CardGridCellProps } from './card-grid-cell/card-grid-cell.vue'
