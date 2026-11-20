import Panel from './panel.vue'
import PanelBody from './panel-body.vue'
import PanelFooter from './panel-footer.vue'
import PanelHeader from './panel-header.vue'

export default Object.assign(Panel, {
  Header: PanelHeader,
  Body: PanelBody,
  Footer: PanelFooter
})

export { PanelBody, PanelFooter, PanelHeader }
export type { PanelSize } from './injection-key'
export type { PanelProps } from './panel.vue'
