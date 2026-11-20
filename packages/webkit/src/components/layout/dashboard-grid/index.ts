import DashboardGridRoot from './dashboard-grid.vue'
import DashboardGridItem from './dashboard-grid-item/dashboard-grid-item.vue'

interface DashboardGridStatic {
  Item: typeof DashboardGridItem
}

const DashboardGrid = DashboardGridRoot as typeof DashboardGridRoot & DashboardGridStatic
DashboardGrid.Item = DashboardGridItem

export default DashboardGrid
export { DashboardGridItem }
export type { DashboardGridProps } from './dashboard-grid.vue'
export type { DashboardGridItemProps } from './dashboard-grid-item/dashboard-grid-item.vue'
export type { DashboardGridLayoutItem, DashboardGridMoveDirection } from './injection-key'
