import ConsoleLayoutRoot from './console-layout.vue'
import ConsoleLayoutBreadcrumb from './console-layout-breadcrumb/console-layout-breadcrumb.vue'
import ConsoleLayoutToolsTrigger from './console-layout-tools-trigger/console-layout-tools-trigger.vue'

interface ConsoleLayoutStatic {
  Breadcrumb: typeof ConsoleLayoutBreadcrumb
  ToolsTrigger: typeof ConsoleLayoutToolsTrigger
}

const ConsoleLayout = Object.assign(ConsoleLayoutRoot, {
  Breadcrumb: ConsoleLayoutBreadcrumb,
  ToolsTrigger: ConsoleLayoutToolsTrigger
}) as typeof ConsoleLayoutRoot & ConsoleLayoutStatic

export default ConsoleLayout

export { ConsoleLayoutBreadcrumb, ConsoleLayoutToolsTrigger }

export type { DropdownMenuItemValue } from '../../navigation/dropdown-menu/injection-key'
export type {
  BreadcrumbItemData,
  ConsoleLayoutAccount,
  ConsoleLayoutNavGroup,
  ConsoleLayoutNavItem
} from './console-layout.vue'
export type { ConsoleLayoutProps } from './console-layout.vue'
export type { ConsoleLayoutBreadcrumbProps } from './console-layout-breadcrumb/console-layout-breadcrumb.vue'
export type { ConsoleLayoutToolsTriggerProps } from './console-layout-tools-trigger/console-layout-tools-trigger.vue'
