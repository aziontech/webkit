import type { ToolCallStatus } from '../../components/ai/tool-call/tool-call.vue'
import type { ImageGalleryItem } from '../../components/content/image-gallery/image-gallery.vue'
import { imageOf, isImagePart, isTextPart } from './ai-chat-parts'
import type {
  AiChatPart,
  AiChatQuestion,
  AiChatStructuredOutputPart,
  AiChatTool,
  AiChatToolCallPart,
  AiChatToolResultPart
} from './ai-chat-types'

type ToolStatusRule = [
  (call: AiChatToolCallPart, result?: AiChatToolResultPart) => boolean,
  ToolCallStatus
]

const TOOL_STATUS_RULES: ToolStatusRule[] = [
  [(call, result) => result?.outcome === 'denied' || call.approval?.approved === false, 'denied'],
  [(_, result) => result?.outcome === 'cancelled', 'canceled'],
  [(call, result) => call.state === 'error' || result?.state === 'error', 'error'],
  [(call, result) => call.state === 'complete' || result?.state === 'complete', 'success'],
  [(call) => call.state === 'awaiting-input' || call.state === 'input-streaming', 'streaming']
]

export function toolStatusOf(
  call: AiChatToolCallPart,
  result?: AiChatToolResultPart
): ToolCallStatus {
  return TOOL_STATUS_RULES.find(([matches]) => matches(call, result))?.[1] ?? 'running'
}

export function structuredOf(part: AiChatStructuredOutputPart): string {
  if (part.status === 'complete') return json(part.data)
  return json(part.partial) || part.raw
}

export interface AiChatToolContent {
  text: string
  images: ImageGalleryItem[]
}

export function toolContentOf(content: unknown): AiChatToolContent | null {
  if (!Array.isArray(content) || !content.length) return null
  const texts: string[] = []
  const images: ImageGalleryItem[] = []
  for (const [index, part] of (content as AiChatPart[]).entries()) {
    if (!part || typeof part !== 'object') return null
    if (isTextPart(part)) texts.push(part.content)
    else if (isImagePart(part)) {
      const image = imageOf(part, index)
      if (image) images.push(image)
    } else return null
  }
  return { text: texts.filter(Boolean).join('\n\n'), images }
}

export function answerable(
  tool: AiChatTool | undefined,
  call: AiChatToolCallPart,
  result?: AiChatToolResultPart
): boolean {
  return Boolean(tool?.answerable) && call.output === undefined && !result && call.state !== 'error'
}

export function toolQuestionOf(call: AiChatToolCallPart, tool: AiChatTool): AiChatQuestion {
  return {
    id: call.id,
    title: tool.question || tool.title || `Answer ${call.name}`,
    options: tool.options ?? [],
    status: 'pending',
    error: '',
    bound: true
  }
}

export function needsApproval(call: AiChatToolCallPart): boolean {
  return call.state === 'approval-requested' || Boolean(call.approval?.needsApproval)
}

export function approvalOf(call: AiChatToolCallPart): 'pending' | 'approved' | 'denied' {
  if (call.approval?.approved === true) return 'approved'
  if (call.approval?.approved === false) return 'denied'
  return 'pending'
}

export function json(value: unknown): string {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export function parsesAsJson(text: string): boolean {
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}
