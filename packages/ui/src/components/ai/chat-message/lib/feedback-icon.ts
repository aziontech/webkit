import type { ChatMessageFeedbackValue } from '../injection-key'

export function feedbackIcon(value: ChatMessageFeedbackValue | null): string {
  if (value === 'up') return 'az az-thumbs-up-fill'
  if (value === 'down') return 'az az-thumbs-down-fill'
  return 'az az-thumbs-up'
}
