import {
  activityStepOf,
  imageOf,
  isActivityPart,
  isAudioPart,
  isDocumentPart,
  isImagePart,
  isStructuredOutputPart,
  isSubagentPart,
  isTextPart,
  isThinkingPart,
  isToolCallPart,
  isToolResultPart,
  isUiResourcePart,
  isVideoPart,
  mediaUrl
} from './ai-chat-parts'
import type {
  AiChatActivityPart,
  AiChatMessage,
  AiChatPart,
  AiChatSegment,
  AiChatToolResultPart
} from './ai-chat-types'

type SegmentContext = {
  segments: AiChatSegment[]
  results: Map<string, AiChatToolResultPart>
  index: number
}

type SegmentBuilder = (part: AiChatPart, context: SegmentContext) => void

const lastSegment = (segments: AiChatSegment[]) => segments[segments.length - 1]

const SEGMENT_BUILDERS: Partial<Record<AiChatPart['type'], SegmentBuilder>> = {
  text(part, { segments, index }) {
    if (!isTextPart(part) || !part.content) return
    const previous = lastSegment(segments)
    if (previous?.type === 'text') previous.content = `${previous.content}\n\n${part.content}`
    else segments.push({ type: 'text', key: `text-${index}`, content: part.content })
  },
  'tool-call'(part, { segments, results }) {
    if (!isToolCallPart(part)) return
    segments.push({ type: 'tool', key: part.id, call: part, result: results.get(part.id) })
  },
  image(part, { segments, index }) {
    const image = isImagePart(part) ? imageOf(part, index) : null
    if (!image) return
    const previous = lastSegment(segments)
    if (previous?.type === 'gallery') previous.images.push(image)
    else segments.push({ type: 'gallery', key: `gallery-${index}`, images: [image] })
  },
  audio(part, { segments, index }) {
    if (!isAudioPart(part)) return
    const src = mediaUrl(part.source)
    if (src) segments.push({ type: 'audio', key: part.id ?? `audio-${index}`, src })
  },
  video(part, { segments, index }) {
    if (!isVideoPart(part)) return
    const src = mediaUrl(part.source)
    if (!src) return
    segments.push({
      type: 'video',
      key: part.id ?? `video-${index}`,
      src,
      mimeType: part.source.mimeType ?? ''
    })
  },
  document(part, { segments, index }) {
    if (!isDocumentPart(part)) return
    if (part.source.type === 'url' || part.source.type === 'data')
      segments.push({ type: 'document', key: part.id ?? `document-${index}`, part })
  },
  subagent(part, { segments, index }) {
    if (isSubagentPart(part)) segments.push({ type: 'subagent', key: `subagent-${index}`, part })
  },
  'ui-resource'(part, { segments, index }) {
    if (isUiResourcePart(part))
      segments.push({ type: 'app', key: `app-${part.toolCallId}-${index}`, part })
  },
  'structured-output'(part, { segments, index }) {
    if (isStructuredOutputPart(part))
      segments.push({ type: 'structured', key: `structured-${index}`, part })
  }
}

const reasoningOf = (part: AiChatPart): string[] => {
  if (isThinkingPart(part)) return [part.content]
  if (isStructuredOutputPart(part) && part.reasoning) return [part.reasoning]
  return []
}

const leadingSegments = (
  message: AiChatMessage,
  activities: ReadonlyArray<AiChatActivityPart>
): AiChatSegment[] => {
  const steps = [...activities, ...message.parts.filter(isActivityPart)].map((part, index) =>
    activityStepOf(part, `step-${index}`)
  )
  const segments: AiChatSegment[] = steps.length
    ? [{ type: 'activity', key: 'activity', steps }]
    : []
  const thinking = message.parts.flatMap(reasoningOf).join('\n\n')
  if (thinking) segments.push({ type: 'reasoning', key: 'reasoning', content: thinking })
  return segments
}

export function segmentsOf(
  message: AiChatMessage,
  activities: ReadonlyArray<AiChatActivityPart> = []
): AiChatSegment[] {
  const results = new Map<string, AiChatToolResultPart>()
  for (const part of message.parts) {
    if (isToolResultPart(part)) results.set(part.toolCallId, part)
  }
  const segments = leadingSegments(message, activities)
  message.parts.forEach((part, index) => {
    SEGMENT_BUILDERS[part.type]?.(part, { segments, results, index })
  })
  return segments
}
