import PanelBody from '../panel/panel-body.vue'
import PanelFooter from '../panel/panel-footer.vue'
import PanelHeader from '../panel/panel-header.vue'
import Dialog from './dialog.vue'
import DialogClose from './dialog-close.vue'
import DialogContent from './dialog-content.vue'
import DialogDescription from './dialog-description.vue'
import DialogTitle from './dialog-title.vue'
import DialogTrigger from './dialog-trigger.vue'

export default Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: PanelHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Body: PanelBody,
  Footer: PanelFooter
})

export { DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger }
export type { DialogProps } from './dialog.vue'
export type { DialogCloseProps } from './dialog-close.vue'
export type { DialogSize } from './injection-key'
