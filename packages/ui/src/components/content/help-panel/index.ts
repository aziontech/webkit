import HelpPanel from './help-panel.vue'
import HelpPanelFooter from './help-panel-footer/help-panel-footer.vue'
import HelpPanelGroup from './help-panel-group/help-panel-group.vue'
import HelpPanelHeader from './help-panel-header/help-panel-header.vue'

type CompoundHelpPanel = typeof HelpPanel & {
  Header: typeof HelpPanelHeader
  Group: typeof HelpPanelGroup
  Footer: typeof HelpPanelFooter
}

const HelpPanelRoot = Object.assign(HelpPanel, {
  Header: HelpPanelHeader,
  Group: HelpPanelGroup,
  Footer: HelpPanelFooter
}) as CompoundHelpPanel

export default HelpPanelRoot
export { HelpPanelFooter, HelpPanelGroup, HelpPanelHeader }
export type { HelpPanelProps } from './help-panel.vue'
export type { HelpPanelFooterProps } from './help-panel-footer/help-panel-footer.vue'
export type { HelpPanelGroupProps } from './help-panel-group/help-panel-group.vue'
export type { HelpPanelHeaderProps } from './help-panel-header/help-panel-header.vue'
