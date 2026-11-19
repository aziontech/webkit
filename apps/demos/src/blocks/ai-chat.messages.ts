import type { AgentActivityStatus, AgentActivityStep } from '@aziontech/webkit/agent-activity'
import type { AgentQuestionOption, AgentQuestionStatus } from '@aziontech/webkit/agent-question'
import type { ImageGalleryItem } from '@aziontech/webkit/image-gallery'
import type { PromptQueueItem } from '@aziontech/webkit/prompt-queue'
import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SubagentCardStatus } from '@aziontech/webkit/subagent-card'
import type { ToolApprovalVariant } from '@aziontech/webkit/tool-approval'
import type { ToolCallStatus } from '@aziontech/webkit/tool-call'

/** Who wrote a message; the conversation draws the reader's and the assistant's. */
export type AiChatRole = 'system' | 'user' | 'assistant' | 'activity'

/** Text of a message: plain for the reader, Markdown for the assistant. */
export interface AiChatTextPart {
  type: 'text'
  content: string
}

/** How the assistant reached the answer, shown in the collapsible Reasoning. */
export interface AiChatThinkingPart {
  type: 'thinking'
  content: string
}

/** Where a tool call stands. */
export type AiChatToolCallState =
  | 'awaiting-input'
  | 'input-streaming'
  | 'input-complete'
  | 'approval-requested'
  | 'approval-responded'
  | 'complete'
  | 'error'

/** A tool the assistant calls; one that needs approval carries `approval`. */
export interface AiChatToolCallPart {
  type: 'tool-call'
  id: string
  name: string
  arguments: string
  input?: unknown
  state: AiChatToolCallState
  output?: unknown
  approval?: {
    id: string
    needsApproval: boolean
    approved?: boolean
  }
}

/** What a tool returned, matched to its call by `toolCallId`. */
export interface AiChatToolResultPart {
  type: 'tool-result'
  toolCallId: string
  content: unknown
  state: 'streaming' | 'complete' | 'error'
  outcome?: 'cancelled' | 'denied'
  error?: string
}

/** Where the bytes of an image, audio, video or document come from: a URL, base64 data, or a provider file the block cannot draw. */
export interface AiChatMediaSource {
  type: 'url' | 'data' | 'file'
  value: string
  mimeType?: string
}

/** An image the message carries; consecutive images draw as one gallery. */
export interface AiChatImagePart {
  type: 'image'
  id?: string
  source: AiChatMediaSource
  metadata?: unknown
}

/** An audio clip the message carries. */
export interface AiChatAudioPart {
  type: 'audio'
  id?: string
  source: AiChatMediaSource
  metadata?: unknown
}

/** A video the message carries. */
export interface AiChatVideoPart {
  type: 'video'
  id?: string
  source: AiChatMediaSource
  metadata?: unknown
}

/** A document the message carries, such as a PDF; `metadata.name` names it. */
export interface AiChatDocumentPart {
  type: 'document'
  id?: string
  source: AiChatMediaSource
  metadata?: unknown
}

/** A step the agent reports; `content.title`, `content.status` and `content.detail` draw it. */
export interface AiChatActivityPart {
  type: 'activity'
  activityType: string
  content: Record<string, unknown>
}

/** Where a helper agent stands. */
export type AiChatSubagentStatus = 'running' | 'finished' | 'error' | 'suspended'

/** A helper agent the assistant started, with its own messages. */
export interface AiChatSubagentPart {
  type: 'subagent'
  subagent: {
    name: string
    description?: string
    status: AiChatSubagentStatus
    messages: ReadonlyArray<AiChatMessage>
    input?: unknown
    error?: { message: string }
    stop?: unknown
  }
}

/** An interactive widget a tool returned (an MCP app), drawn in a sandboxed frame. */
export interface AiChatUiResourcePart {
  type: 'ui-resource'
  resource: { uri: string; mimeType: string; text?: string; blob?: string }
  toolCallId: string
  toolName: string
  serverId?: string
}

/** A part the conversation does not draw, such as structured output. */
export interface AiChatOtherPart {
  type: string
}

/** One piece of a message, in the order it arrived. */
export type AiChatPart =
  | AiChatTextPart
  | AiChatThinkingPart
  | AiChatToolCallPart
  | AiChatToolResultPart
  | AiChatImagePart
  | AiChatAudioPart
  | AiChatVideoPart
  | AiChatDocumentPart
  | AiChatActivityPart
  | AiChatSubagentPart
  | AiChatUiResourcePart
  | AiChatOtherPart

/** What the app adds to a message beside its parts. */
export interface AiChatMessageMetadata {
  /** The documents the response cites, numbered in order. */
  sources?: SourcesItem[]
  /** How long the assistant thought, in seconds; left out, the block measures it while it streams. */
  reasoningSeconds?: number
  /** The reader stopped this response; the block also marks the response Stop ends. */
  stopped?: boolean
}

/** One message, in the shape TanStack AI's `useChat` returns. */
export interface AiChatMessage {
  /** Stable key. */
  id: string
  /** Who wrote it; `system` and `activity` messages are not drawn. */
  role: AiChatRole
  /** The text, reasoning and tool calls, in order. */
  parts: ReadonlyArray<AiChatPart>
  /** When it was written. */
  createdAt?: Date
  /** Sources, the thinking time and the stopped flag. */
  metadata?: AiChatMessageMetadata & Record<string, unknown>
}

/** How a tool reads in the conversation and on its approval card. */
export interface AiChatTool {
  /** What the call does, in plain words. */
  title: string
  /** The question on the approval card, naming the action; left out, the title. */
  question?: string
  /** What changes and what stays, on the approval card. */
  description?: string
  /** The approve button label, the verb of the title. */
  approveLabel?: string
  /** Danger for an irreversible action. */
  variant?: ToolApprovalVariant
  /** The phrase the reader types before an irreversible action enables. */
  confirmationPhrase?: string
  /** The reader may edit the call's arguments, as JSON, before approving. */
  editable?: boolean
}

/** A pending request from the chat, as TanStack AI's `useChat` returns it in `interrupts`. */
export interface AiChatInterrupt {
  kind: string
  id?: string
  toolCallId?: string
  message?: string
  metadata?: Readonly<Record<string, unknown>>
  payload?: unknown
  status?: string
  errors?: ReadonlyArray<{ message: string }>
  resolveInterrupt?: unknown
  cancel?: unknown
}

/** A message waiting to be sent, as `useChat` returns it in `queue`. */
export interface AiChatQueuedMessage {
  id: string
  content: unknown
}

/** The state of the connection to the chat, as `useChat` returns `connectionStatus`. */
export type AiChatConnection = 'disconnected' | 'connecting' | 'connected' | 'error'

/** A question the agent asked through a generic interrupt, as the block draws it. */
export interface AiChatQuestion {
  id: string
  title: string
  options: AgentQuestionOption[]
  status: AgentQuestionStatus
  error: string
}

/** A rendered piece of an assistant message. */
export type AiChatSegment =
  | { type: 'activity'; key: string; steps: AgentActivityStep[] }
  | { type: 'reasoning'; key: string; content: string }
  | { type: 'text'; key: string; content: string }
  | { type: 'tool'; key: string; call: AiChatToolCallPart; result?: AiChatToolResultPart }
  | { type: 'gallery'; key: string; images: ImageGalleryItem[] }
  | { type: 'audio'; key: string; src: string }
  | { type: 'video'; key: string; src: string; mimeType: string }
  | { type: 'document'; key: string; part: AiChatDocumentPart }
  | { type: 'subagent'; key: string; part: AiChatSubagentPart }
  | { type: 'app'; key: string; part: AiChatUiResourcePart }

export const isUiResourcePart = (part: AiChatPart): part is AiChatUiResourcePart =>
  part.type === 'ui-resource'

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

export function hasThinking(message: AiChatMessage): boolean {
  return message.parts.some(isThinkingPart)
}

export function segmentsOf(
  message: AiChatMessage,
  activities: ReadonlyArray<AiChatActivityPart> = []
): AiChatSegment[] {
  const results = new Map<string, AiChatToolResultPart>()
  for (const part of message.parts) {
    if (isToolResultPart(part)) results.set(part.toolCallId, part)
  }
  const steps = [...activities, ...message.parts.filter(isActivityPart)].map((part, index) =>
    activityStepOf(part, `step-${index}`)
  )
  const segments: AiChatSegment[] = steps.length
    ? [{ type: 'activity', key: 'activity', steps }]
    : []
  const thinking = message.parts
    .filter(isThinkingPart)
    .map((part) => part.content)
    .join('\n\n')
  if (thinking) segments.push({ type: 'reasoning', key: 'reasoning', content: thinking })
  message.parts.forEach((part, index) => {
    const previous = segments[segments.length - 1]
    if (isTextPart(part)) {
      if (!part.content) return
      if (previous?.type === 'text') previous.content = `${previous.content}\n\n${part.content}`
      else segments.push({ type: 'text', key: `text-${index}`, content: part.content })
    } else if (isToolCallPart(part)) {
      segments.push({ type: 'tool', key: part.id, call: part, result: results.get(part.id) })
    } else if (isImagePart(part)) {
      const image = imageOf(part, index)
      if (!image) return
      if (previous?.type === 'gallery') previous.images.push(image)
      else segments.push({ type: 'gallery', key: `gallery-${index}`, images: [image] })
    } else if (isAudioPart(part)) {
      const src = mediaUrl(part.source)
      if (src) segments.push({ type: 'audio', key: part.id ?? `audio-${index}`, src })
    } else if (isVideoPart(part)) {
      const src = mediaUrl(part.source)
      if (src)
        segments.push({
          type: 'video',
          key: part.id ?? `video-${index}`,
          src,
          mimeType: part.source.mimeType ?? ''
        })
    } else if (isDocumentPart(part)) {
      if (part.source.type === 'url' || part.source.type === 'data')
        segments.push({ type: 'document', key: part.id ?? `document-${index}`, part })
    } else if (isSubagentPart(part)) {
      segments.push({ type: 'subagent', key: `subagent-${index}`, part })
    } else if (isUiResourcePart(part)) {
      segments.push({ type: 'app', key: `app-${part.toolCallId}-${index}`, part })
    }
  })
  return segments
}

export function toolStatusOf(
  call: AiChatToolCallPart,
  result?: AiChatToolResultPart
): ToolCallStatus {
  if (result?.outcome === 'denied' || call.approval?.approved === false) return 'denied'
  if (result?.outcome === 'cancelled') return 'canceled'
  if (call.state === 'error' || result?.state === 'error') return 'error'
  if (call.state === 'complete' || result?.state === 'complete') return 'success'
  if (call.state === 'awaiting-input' || call.state === 'input-streaming') return 'streaming'
  return 'running'
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

export function resolveInterrupt(
  interrupts: ReadonlyArray<AiChatInterrupt> | undefined,
  call: AiChatToolCallPart,
  approved: boolean,
  editedArgs?: unknown
): void {
  const interrupt = interrupts?.find(
    (item) => item.kind === 'tool-approval' && item.toolCallId === call.id
  )
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve !== 'function') return
  if (editedArgs === undefined) resolve.call(interrupt, approved)
  else resolve.call(interrupt, approved, { editedArgs })
}

export function isQuestion(interrupt: AiChatInterrupt): boolean {
  return interrupt.kind === 'generic' && Boolean(interrupt.id)
}

function optionsIn(value: unknown): AgentQuestionOption[] {
  if (!value || typeof value !== 'object' || !('options' in value)) return []
  const options = (value as { options?: unknown }).options
  if (!Array.isArray(options)) return []
  return options.flatMap((option): AgentQuestionOption[] => {
    if (typeof option === 'string') return [{ value: option, label: option }]
    if (option && typeof option === 'object' && 'value' in option) {
      const { value: answer, label } = option as { value?: unknown; label?: unknown }
      if (typeof answer !== 'string') return []
      return [{ value: answer, label: typeof label === 'string' ? label : answer }]
    }
    return []
  })
}

const QUESTION_STATUS: Record<string, AgentQuestionStatus> = {
  validating: 'running',
  staged: 'running',
  submitting: 'running',
  error: 'error'
}

export function questionOf(interrupt: AiChatInterrupt): AiChatQuestion {
  const options = optionsIn(interrupt.metadata)
  return {
    id: interrupt.id ?? '',
    title: interrupt.message || 'The agent needs an answer to continue.',
    options: options.length ? options : optionsIn(interrupt.payload),
    status: QUESTION_STATUS[interrupt.status ?? ''] ?? 'pending',
    error: interrupt.errors?.[0]?.message ?? ''
  }
}

export function answerInterrupt(interrupt: AiChatInterrupt | undefined, value: string): void {
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve === 'function') resolve.call(interrupt, value)
}

export function skipInterrupt(interrupt: AiChatInterrupt | undefined): void {
  const cancel = interrupt?.cancel
  if (typeof cancel === 'function') cancel.call(interrupt)
}

export function queueItemOf(message: AiChatQueuedMessage): PromptQueueItem {
  const content =
    message.content && typeof message.content === 'object' && 'content' in message.content
      ? (message.content as { content: unknown }).content
      : message.content
  if (typeof content === 'string') return { id: message.id, text: content }
  const parts: unknown[] = Array.isArray(content) ? content : []
  const texts = parts.flatMap((part) =>
    part &&
    typeof part === 'object' &&
    (part as { type?: unknown }).type === 'text' &&
    typeof (part as { content?: unknown }).content === 'string'
      ? [(part as { content: string }).content]
      : []
  )
  return { id: message.id, text: texts.join(' '), attachmentCount: parts.length - texts.length }
}
