import HelpPanel from './help-panel.vue'
import HelpPanelHeader from './help-panel-header/help-panel-header.vue'
import HelpPanelLinks from './help-panel-links/help-panel-links.vue'
import HelpPanelSection from './help-panel-section/help-panel-section.vue'

type CompoundHelpPanel = typeof HelpPanel & {
  Header: typeof HelpPanelHeader
  Section: typeof HelpPanelSection
  Links: typeof HelpPanelLinks
}

const HelpPanelRoot = Object.assign(HelpPanel, {
  Header: HelpPanelHeader,
  Section: HelpPanelSection,
  Links: HelpPanelLinks
}) as CompoundHelpPanel

export default HelpPanelRoot
export { HelpPanelHeader, HelpPanelLinks, HelpPanelSection }
