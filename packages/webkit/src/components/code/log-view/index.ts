import LogView from './log-view.vue'
import LogViewContent from './log-view-content.vue'
import LogViewFooter from './log-view-footer.vue'
import LogViewHeader from './log-view-header.vue'

type CompoundLogView = typeof LogView & {
  Header: typeof LogViewHeader
  Content: typeof LogViewContent
  Footer: typeof LogViewFooter
}

const LogViewRoot = Object.assign(LogView, {
  Header: LogViewHeader,
  Content: LogViewContent,
  Footer: LogViewFooter
}) as CompoundLogView

export default LogViewRoot
export type { LogViewLine, LogViewLineLevel, LogViewLineType } from './log-view.vue'
