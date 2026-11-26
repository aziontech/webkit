import type {
  AgentActivityStatus,
  AgentActivityStep
} from '../../components/ai/agent-activity/agent-activity.vue'
import type { SubagentCardStatus } from '../../components/ai/subagent-card/subagent-card.vue'
import type { ImageGalleryItem } from '../../components/content/image-gallery/image-gallery.vue'
import type {
  AiChatActivityPart,
  AiChatAudioPart,
  AiChatDocumentPart,
  AiChatImagePart,
  AiChatMediaSource,
  AiChatMessage,
  AiChatPart,
  AiChatStructuredOutputPart,
  AiChatSubagentPart,
  AiChatTextPart,
  AiChatThinkingPart,
  AiChatToolCallPart,
  AiChatToolResultPart,
  AiChatUiResourcePart,
  AiChatVideoPart
} from './ai-chat-types'

export const isUiResourcePart = (part: AiChatPart): part is AiChatUiResourcePart =>
  part.type === 'ui-resource'

export const isStructuredOutputPart = (part: AiChatPart): part is AiChatStructuredOutputPart =>
  part.type === 'structured-output'

export const isTextPart = (part: AiChatPart): part is AiChatTextPart => part.type === 'text'

export const isThinkingPart = (part: AiChatPart): part is AiChatThinkingPart =>
  part.type === 'thinking'

export const isToolCallPart = (part: AiChatPart): part is AiChatToolCallPart =>
  part.type === 'tool-call'

export const isToolResultPart = (part: AiChatPart): part is AiChatToolResultPart =>
  part.type === 'tool-result'

export const isImagePart = (part: AiChatPart): part is AiChatImagePart => part.type === 'image'

export const isAudioPart = (part: AiChatPart): part is AiChatAudioPart => part.type === 'audio'

export const isVideoPart = (part: AiChatPart): part is AiChatVideoPart => part.type === 'video'

export const isDocumentPart = (part: AiChatPart): part is AiChatDocumentPart =>
  part.type === 'document'

export const isActivityPart = (part: AiChatPart): part is AiChatActivityPart =>
  part.type === 'activity'

export const isSubagentPart = (part: AiChatPart): part is AiChatSubagentPart =>
  part.type === 'subagent'

export function mediaUrl(source: AiChatMediaSource): string {
  if (source.type === 'url') return source.value
  if (source.type !== 'data') return ''
  if (source.value.startsWith('data:')) return source.value
  return `data:${source.mimeType ?? 'application/octet-stream'};base64,${source.value}`
}

function metadataText(metadata: unknown, key: string): string {
  if (!metadata || typeof metadata !== 'object' || !(key in metadata)) return ''
  const value = (metadata as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

export function imageOf(part: AiChatImagePart, index: number): ImageGalleryItem | null {
  const key = part.id ?? `image-${index}`
  const alt = metadataText(part.metadata, 'alt')
  if (part.source.type === 'url') return { key, src: part.source.value, alt }
  if (part.source.type === 'data')
    return { key, data: part.source.value, mimeType: part.source.mimeType, alt }
  return null
}

export function documentNameOf(part: AiChatDocumentPart): string {
  return metadataText(part.metadata, 'name') || 'Document'
}

const ACTIVITY_STATUS: Record<string, AgentActivityStatus> = {
  pending: 'pending',
  running: 'running',
  success: 'success',
  complete: 'success',
  error: 'error',
  canceled: 'canceled',
  cancelled: 'canceled',
  skipped: 'skipped'
}

export function activityStepOf(part: AiChatActivityPart, key: string): AgentActivityStep {
  const { title, status, detail } = part.content
  return {
    key,
    title: typeof title === 'string' && title ? title : part.activityType,
    status: (typeof status === 'string' && ACTIVITY_STATUS[status]) || 'running',
    description: typeof detail === 'string' && detail ? detail : undefined
  }
}

export function activitiesBefore(
  messages: ReadonlyArray<AiChatMessage>,
  turn: AiChatMessage
): AiChatActivityPart[] {
  const parts: AiChatActivityPart[] = []
  for (let index = messages.indexOf(turn) - 1; index >= 0; index--) {
    const message = messages[index]!
    if (message.role === 'user' || message.role === 'assistant') break
    if (message.role === 'activity') parts.unshift(...message.parts.filter(isActivityPart))
  }
  return parts
}

export function subagentStatusOf(part: AiChatSubagentPart): SubagentCardStatus {
  const { status, error } = part.subagent
  if (status === 'finished') return 'success'
  if (status === 'suspended') return 'pending'
  if (status === 'error') return error?.message === 'Stopped' ? 'canceled' : 'error'
  return 'running'
}

export function subagentTextOf(part: AiChatSubagentPart): string {
  return part.subagent.messages
    .filter((message) => message.role === 'assistant')
    .map((message) => textOf(message))
    .filter(Boolean)
    .join('\n\n')
}

export function stopSubagent(part: AiChatSubagentPart): void {
  const stop = part.subagent.stop
  if (typeof stop === 'function') stop.call(part.subagent)
}

export function textOf(message: AiChatMessage, separator = '\n\n'): string {
  return message.parts
    .filter(isTextPart)
    .map((part) => part.content)
    .filter(Boolean)
    .join(separator)
}

export function hasText(message: AiChatMessage): boolean {
  return message.parts.some((part) => isTextPart(part) && part.content.length > 0)
}

export function hasAnswer(message: AiChatMessage): boolean {
  return (
    hasText(message) ||
    message.parts.some((part) => isStructuredOutputPart(part) && part.raw.length > 0)
  )
}

export function hasThinking(message: AiChatMessage): boolean {
  return message.parts.some(isThinkingPart)
}
