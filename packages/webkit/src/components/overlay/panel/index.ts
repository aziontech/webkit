import Panel from './panel.vue'
import PanelContent from './panel-content.vue'
import PanelFooter from './panel-footer.vue'
import PanelHeader from './panel-header.vue'

export default Object.assign(Panel, {
  Header: PanelHeader,
  Content: PanelContent,
  Footer: PanelFooter
})

export { PanelContent, PanelFooter, PanelHeader }
export type { PanelSize } from './injection-key'
export type { PanelProps } from './panel.vue'
