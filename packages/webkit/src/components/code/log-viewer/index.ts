import LogViewer from './log-viewer.vue'
import LogViewerContent from './log-viewer-content.vue'
import LogViewerFooter from './log-viewer-footer.vue'
import LogViewerHeader from './log-viewer-header.vue'
import LogViewerSteps from './log-viewer-steps.vue'

type CompoundLogViewer = typeof LogViewer & {
  Header: typeof LogViewerHeader
  Content: typeof LogViewerContent
  Footer: typeof LogViewerFooter
  Steps: typeof LogViewerSteps
}

const LogViewerRoot = Object.assign(LogViewer, {
  Header: LogViewerHeader,
  Content: LogViewerContent,
  Footer: LogViewerFooter,
  Steps: LogViewerSteps
}) as CompoundLogViewer

export default LogViewerRoot
export type { LogViewerStep, LogViewerStepStatus, LogViewerStepsView } from './injection-key'
export type { LogViewerLine, LogViewerLineLevel, LogViewerLineType } from './log-viewer.vue'
export type { LogViewerProps } from './log-viewer.vue'
export type { LogViewerStepsProps } from './log-viewer-steps.vue'
