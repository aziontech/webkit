import PanelContent from '../panel/panel-content.vue'
import PanelFooter from '../panel/panel-footer.vue'
import PanelHeader from '../panel/panel-header.vue'
import Drawer from './drawer.vue'
import DrawerClose from './drawer-close.vue'
import DrawerContent from './drawer-content.vue'
import DrawerDescription from './drawer-description.vue'
import DrawerTitle from './drawer-title.vue'
import DrawerTrigger from './drawer-trigger.vue'

export default Object.assign(Drawer, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: PanelHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  Body: PanelContent,
  Footer: PanelFooter
})

export { DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger }
export type { DrawerSide, DrawerSize } from './injection-key'
