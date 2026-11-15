import HoverCardRoot from './hover-card.vue'
import HoverCardContent from './hover-card-content/hover-card-content.vue'
import HoverCardTrigger from './hover-card-trigger/hover-card-trigger.vue'

interface HoverCardStatic {
  Trigger: typeof HoverCardTrigger
  Content: typeof HoverCardContent
}

const HoverCard = HoverCardRoot as typeof HoverCardRoot & HoverCardStatic
HoverCard.Trigger = HoverCardTrigger
HoverCard.Content = HoverCardContent

export default HoverCard
export { HoverCardContent, HoverCardTrigger }
export type { HoverCardPlacement } from './hover-card.vue'
export type { HoverCardPlacementSide, HoverCardProps } from './hover-card.vue'
