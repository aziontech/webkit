import LogView from './log-view.vue'
import LogViewContent from './log-view-content.vue'
import LogViewFooter from './log-view-footer.vue'
import LogViewHeader from './log-view-header.vue'
import LogViewSteps from './log-view-steps.vue'

type CompoundLogView = typeof LogView & {
  Header: typeof LogViewHeader
  Content: typeof LogViewContent
  Footer: typeof LogViewFooter
  Steps: typeof LogViewSteps
}

const LogViewRoot = Object.assign(LogView, {
  Header: LogViewHeader,
  Content: LogViewContent,
  Footer: LogViewFooter,
  Steps: LogViewSteps
}) as CompoundLogView

export default LogViewRoot
export type { LogViewStep, LogViewStepStatus, LogViewStepsView } from './injection-key'
export type { LogViewLine, LogViewLineLevel, LogViewLineType } from './log-view.vue'
