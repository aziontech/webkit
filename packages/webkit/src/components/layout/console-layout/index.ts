import ConsoleLayoutRoot from './console-layout.vue'
import ConsoleLayoutBreadcrumbs from './console-layout-breadcrumbs/console-layout-breadcrumbs.vue'

interface ConsoleLayoutStatic {
  Breadcrumbs: typeof ConsoleLayoutBreadcrumbs
}

const ConsoleLayout = Object.assign(ConsoleLayoutRoot, {
  Breadcrumbs: ConsoleLayoutBreadcrumbs
}) as typeof ConsoleLayoutRoot & ConsoleLayoutStatic

export default ConsoleLayout

export { ConsoleLayoutBreadcrumbs }

export type { DropdownMenuOptionValue } from '../../navigation/dropdown-menu/injection-key'
export type {
  ConsoleLayoutAccount,
  ConsoleLayoutCrumb,
  ConsoleLayoutNavGroup,
  ConsoleLayoutNavItem
} from './console-layout.vue'
