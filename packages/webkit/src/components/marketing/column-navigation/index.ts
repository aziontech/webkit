import ColumnNavigation from './column-navigation.vue'
import ColumnNavigationColumn from './column-navigation-column/column-navigation-column.vue'
import ColumnNavigationItem from './column-navigation-item/column-navigation-item.vue'

type CompoundColumnNavigation = typeof ColumnNavigation & {
  Column: typeof ColumnNavigationColumn
  Item: typeof ColumnNavigationItem
}

const ColumnNavigationRoot = Object.assign(ColumnNavigation, {
  Column: ColumnNavigationColumn,
  Item: ColumnNavigationItem
}) as CompoundColumnNavigation

export default ColumnNavigationRoot
export { ColumnNavigationColumn, ColumnNavigationItem }
export type {
  ColumnNavigationColumns,
  ColumnNavigationMobileColumns
} from './column-navigation.vue'
export type { ColumnNavigationProps } from './column-navigation.vue'
export type { ColumnNavigationColumnProps } from './column-navigation-column/column-navigation-column.vue'
export type { ColumnNavigationItemTarget } from './column-navigation-item/column-navigation-item.vue'
export type { ColumnNavigationItemProps } from './column-navigation-item/column-navigation-item.vue'
