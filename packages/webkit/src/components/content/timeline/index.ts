import Timeline from './timeline.vue'
import TimelineGroup from './timeline-group/timeline-group.vue'
import TimelineItem from './timeline-item/timeline-item.vue'

type CompoundTimeline = typeof Timeline & {
  Item: typeof TimelineItem
  Group: typeof TimelineGroup
}

const TimelineRoot = Object.assign(Timeline, {
  Item: TimelineItem,
  Group: TimelineGroup
}) as CompoundTimeline

export default TimelineRoot
export { TimelineGroup, TimelineItem }
export { useTimelineContext } from './composables/use-timeline-context'
export type { TimelineContext, TimelineSize, TimelineTimeFormat } from './injection-key'
export type { TimelineProps } from './timeline.vue'
export type { TimelineGroupProps } from './timeline-group/timeline-group.vue'
export type { TimelineItemProps, TimelineItemSeverity } from './timeline-item/timeline-item.vue'
