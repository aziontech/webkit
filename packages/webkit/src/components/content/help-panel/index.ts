import HelpPanel from './help-panel.vue'
import HelpPanelHeader from './help-panel-header/help-panel-header.vue'
import HelpPanelLinks from './help-panel-links/help-panel-links.vue'
import HelpPanelSection from './help-panel-section/help-panel-section.vue'
import HelpPanelTask from './help-panel-task/help-panel-task.vue'
import HelpPanelTutorial from './help-panel-tutorial/help-panel-tutorial.vue'

type CompoundHelpPanel = typeof HelpPanel & {
  Header: typeof HelpPanelHeader
  Section: typeof HelpPanelSection
  Links: typeof HelpPanelLinks
  Tutorial: typeof HelpPanelTutorial
  Task: typeof HelpPanelTask
}

const HelpPanelRoot = Object.assign(HelpPanel, {
  Header: HelpPanelHeader,
  Section: HelpPanelSection,
  Links: HelpPanelLinks,
  Tutorial: HelpPanelTutorial,
  Task: HelpPanelTask
}) as CompoundHelpPanel

export default HelpPanelRoot
export { HelpPanelHeader, HelpPanelLinks, HelpPanelSection, HelpPanelTask, HelpPanelTutorial }
export type { HelpPanelTaskStatus } from './injection-key'
