import ConsoleLayoutRoot from './console-layout.vue'
import ConsoleLayoutBreadcrumb from './console-layout-breadcrumb/console-layout-breadcrumb.vue'

interface ConsoleLayoutStatic {
  Breadcrumb: typeof ConsoleLayoutBreadcrumb
}

const ConsoleLayout = Object.assign(ConsoleLayoutRoot, {
  Breadcrumb: ConsoleLayoutBreadcrumb
}) as typeof ConsoleLayoutRoot & ConsoleLayoutStatic

export default ConsoleLayout

export { ConsoleLayoutBreadcrumb }

export type { DropdownMenuItemValue } from '../../navigation/dropdown-menu/injection-key'
export type {
  BreadcrumbItemData,
  ConsoleLayoutAccount,
  ConsoleLayoutNavGroup,
  ConsoleLayoutNavItem
} from './console-layout.vue'
export type { ConsoleLayoutProps } from './console-layout.vue'
export type { ConsoleLayoutBreadcrumbProps } from './console-layout-breadcrumb/console-layout-breadcrumb.vue'
