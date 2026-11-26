import SidebarRoot from './sidebar.vue'
import SidebarFooter from './sidebar-footer.vue'
import SidebarHeader from './sidebar-header.vue'

interface SidebarStatic {
  Header: typeof SidebarHeader
  Footer: typeof SidebarFooter
}

const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Footer: SidebarFooter
}) as typeof SidebarRoot & SidebarStatic

export default Sidebar

export { SidebarFooter, SidebarHeader }
export type { SidebarCollapsible } from './sidebar.vue'
export type { SidebarProps } from './sidebar.vue'
