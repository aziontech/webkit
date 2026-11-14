import PanelContent from '../panel/panel-content.vue'
import PanelFooter from '../panel/panel-footer.vue'
import PanelHeader from '../panel/panel-header.vue'
import Dialog from './dialog.vue'
import DialogClose from './dialog-close.vue'
import DialogContent from './dialog-content.vue'
import DialogDescription from './dialog-description.vue'
import DialogOverlay from './dialog-overlay.vue'
import DialogPortal from './dialog-portal.vue'
import DialogTitle from './dialog-title.vue'
import DialogTrigger from './dialog-trigger.vue'

export default Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: PanelHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Body: PanelContent,
  Footer: PanelFooter
})

export {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
}
export type { DialogSize } from './injection-key'
