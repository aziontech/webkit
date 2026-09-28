import ColumnNavigation from './column-navigation.vue'
import ColumnNavigationColumn from './column-navigation-column/column-navigation-column.vue'
import ColumnNavigationItem from './column-navigation-item/column-navigation-item.vue'

// Compound API (see .claude/rules/compound-api.md). The explicit CompoundColumnNavigation
// annotation makes declaration emit reference the sub-component types instead of
// expanding the root's private Props.
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
