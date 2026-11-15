import ChartCardRoot from './chart-card.vue'
import ChartCardContent from './chart-card-content/chart-card-content.vue'
import ChartCardControls from './chart-card-controls/chart-card-controls.vue'
import ChartCardDescription from './chart-card-description/chart-card-description.vue'
import ChartCardDragHandle from './chart-card-drag-handle/chart-card-drag-handle.vue'
import ChartCardFooter from './chart-card-footer/chart-card-footer.vue'
import ChartCardHeader from './chart-card-header/chart-card-header.vue'
import ChartCardResizeHandle from './chart-card-resize-handle/chart-card-resize-handle.vue'
import ChartCardTitle from './chart-card-title/chart-card-title.vue'

interface ChartCardStatic {
  Header: typeof ChartCardHeader
  Title: typeof ChartCardTitle
  Description: typeof ChartCardDescription
  Action: typeof ChartCardControls
  DragHandle: typeof ChartCardDragHandle
  Content: typeof ChartCardContent
  Footer: typeof ChartCardFooter
  ResizeHandle: typeof ChartCardResizeHandle
}

const ChartCard = ChartCardRoot as typeof ChartCardRoot & ChartCardStatic
ChartCard.Header = ChartCardHeader
ChartCard.Title = ChartCardTitle
ChartCard.Description = ChartCardDescription
ChartCard.Action = ChartCardControls
ChartCard.DragHandle = ChartCardDragHandle
ChartCard.Content = ChartCardContent
ChartCard.Footer = ChartCardFooter
ChartCard.ResizeHandle = ChartCardResizeHandle

export default ChartCard
export {
  ChartCardContent,
  ChartCardControls,
  ChartCardDescription,
  ChartCardDragHandle,
  ChartCardFooter,
  ChartCardHeader,
  ChartCardResizeHandle,
  ChartCardTitle
}
export type { ChartCardProps } from './chart-card.vue'
export type { ChartCardContentProps } from './chart-card-content/chart-card-content.vue'
export type { ChartCardDragHandleProps } from './chart-card-drag-handle/chart-card-drag-handle.vue'
export type { ChartCardResizeHandleProps } from './chart-card-resize-handle/chart-card-resize-handle.vue'
export type { ChartCardMoveDirection } from './injection-key'
