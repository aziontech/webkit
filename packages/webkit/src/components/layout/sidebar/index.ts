import SidebarRoot from './sidebar.vue'
import SidebarFooter from './sidebar-footer.vue'
import SidebarGroup from './sidebar-group.vue'
import SidebarHeader from './sidebar-header.vue'

interface SidebarStatic {
  Header: typeof SidebarHeader
  Group: typeof SidebarGroup
  Footer: typeof SidebarFooter
}

const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Group: SidebarGroup,
  Footer: SidebarFooter
}) as typeof SidebarRoot & SidebarStatic

export default Sidebar

export { SidebarFooter, SidebarGroup, SidebarHeader }
export type { SidebarCollapsible } from './sidebar.vue'
