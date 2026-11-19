import type { SourcesItem } from '@aziontech/webkit/sources'
import type { ToolApprovalVariant } from '@aziontech/webkit/tool-approval'
import type { ToolCallStatus } from '@aziontech/webkit/tool-call'

/** Who wrote a message; the conversation draws the reader's and the assistant's. */
export type AiChatDrawerRole = 'system' | 'user' | 'assistant' | 'activity'

/** Text of a message: plain for the reader, Markdown for the assistant. */
export interface AiChatDrawerTextPart {
  type: 'text'
  content: string
}

/** How the assistant reached the answer, shown in the collapsible Reasoning. */
export interface AiChatDrawerThinkingPart {
  type: 'thinking'
  content: string
}

/** Where a tool call stands. */
export type AiChatDrawerToolCallState =
  | 'awaiting-input'
  | 'input-streaming'
  | 'input-complete'
  | 'approval-requested'
  | 'approval-responded'
  | 'complete'
  | 'error'

/** A tool the assistant calls; one that needs approval carries `approval`. */
export interface AiChatDrawerToolCallPart {
  type: 'tool-call'
  id: string
  name: string
  arguments: string
  input?: unknown
  state: AiChatDrawerToolCallState
  output?: unknown
  approval?: {
    id: string
    needsApproval: boolean
    approved?: boolean
  }
}

/** What a tool returned, matched to its call by `toolCallId`. */
export interface AiChatDrawerToolResultPart {
  type: 'tool-result'
  toolCallId: string
  content: unknown
  state: 'streaming' | 'complete' | 'error'
  outcome?: 'cancelled' | 'denied'
  error?: string
}

/** A part the conversation does not draw, such as an image or audio. */
export interface AiChatDrawerOtherPart {
  type: string
}

/** One piece of a message, in the order it arrived. */
export type AiChatDrawerPart =
  | AiChatDrawerTextPart
  | AiChatDrawerThinkingPart
  | AiChatDrawerToolCallPart
  | AiChatDrawerToolResultPart
  | AiChatDrawerOtherPart

/** What the app adds to a message beside its parts. */
export interface AiChatDrawerMessageMetadata {
  /** The documents the response cites, numbered in order. */
  sources?: SourcesItem[]
  /** How long the assistant thought, in seconds; left out, the block measures it while it streams. */
  reasoningSeconds?: number
  /** The reader stopped this response; the block also marks the response Stop ends. */
  stopped?: boolean
}

/** One message, in the shape TanStack AI's `useChat` returns. */
export interface AiChatDrawerMessage {
  /** Stable key. */
  id: string
  /** Who wrote it; `system` and `activity` messages are not drawn. */
  role: AiChatDrawerRole
  /** The text, reasoning and tool calls, in order. */
  parts: ReadonlyArray<AiChatDrawerPart>
  /** When it was written. */
  createdAt?: Date
  /** Sources, the thinking time and the stopped flag. */
  metadata?: AiChatDrawerMessageMetadata & Record<string, unknown>
}

/** How a tool reads in the conversation and on its approval card. */
export interface AiChatDrawerTool {
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
}

/** A pending request from the chat, as TanStack AI's `useChat` returns it in `interrupts`. */
export interface AiChatDrawerInterrupt {
  kind: string
  toolCallId?: string
  resolveInterrupt?: unknown
}

/** A rendered piece of an assistant message. */
export type AiChatDrawerSegment =
  | { type: 'reasoning'; key: string; content: string }
  | { type: 'text'; key: string; content: string }
  | {
      type: 'tool'
      key: string
      call: AiChatDrawerToolCallPart
      result?: AiChatDrawerToolResultPart
    }

export const isTextPart = (part: AiChatDrawerPart): part is AiChatDrawerTextPart =>
  part.type === 'text'

export const isThinkingPart = (part: AiChatDrawerPart): part is AiChatDrawerThinkingPart =>
  part.type === 'thinking'

export const isToolCallPart = (part: AiChatDrawerPart): part is AiChatDrawerToolCallPart =>
  part.type === 'tool-call'

export const isToolResultPart = (part: AiChatDrawerPart): part is AiChatDrawerToolResultPart =>
  part.type === 'tool-result'

export function textOf(message: AiChatDrawerMessage, separator = '\n\n'): string {
  return message.parts
    .filter(isTextPart)
    .map((part) => part.content)
    .filter(Boolean)
    .join(separator)
}

export function hasText(message: AiChatDrawerMessage): boolean {
  return message.parts.some((part) => isTextPart(part) && part.content.length > 0)
}

export function hasThinking(message: AiChatDrawerMessage): boolean {
  return message.parts.some(isThinkingPart)
}

export function segmentsOf(message: AiChatDrawerMessage): AiChatDrawerSegment[] {
  const results = new Map<string, AiChatDrawerToolResultPart>()
  for (const part of message.parts) {
    if (isToolResultPart(part)) results.set(part.toolCallId, part)
  }
  const thinking = message.parts
    .filter(isThinkingPart)
    .map((part) => part.content)
    .join('\n\n')
  const segments: AiChatDrawerSegment[] = thinking
    ? [{ type: 'reasoning', key: 'reasoning', content: thinking }]
    : []
  message.parts.forEach((part, index) => {
    const previous = segments[segments.length - 1]
    if (isTextPart(part)) {
      if (!part.content) return
      if (previous?.type === 'text') previous.content = `${previous.content}\n\n${part.content}`
      else segments.push({ type: 'text', key: `text-${index}`, content: part.content })
    } else if (isToolCallPart(part)) {
      segments.push({ type: 'tool', key: part.id, call: part, result: results.get(part.id) })
    }
  })
  return segments
}

export function toolStatusOf(
  call: AiChatDrawerToolCallPart,
  result?: AiChatDrawerToolResultPart
): ToolCallStatus {
  if (result?.outcome === 'denied' || call.approval?.approved === false) return 'denied'
  if (call.state === 'error' || result?.state === 'error') return 'error'
  if (call.state === 'complete' || result?.state === 'complete') return 'success'
  if (call.state === 'awaiting-input') return 'pending'
  return 'running'
}

export function needsApproval(call: AiChatDrawerToolCallPart): boolean {
  return call.state === 'approval-requested' || Boolean(call.approval?.needsApproval)
}

export function approvalOf(call: AiChatDrawerToolCallPart): 'pending' | 'approved' | 'denied' {
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

export function resolveInterrupt(
  interrupts: ReadonlyArray<AiChatDrawerInterrupt> | undefined,
  call: AiChatDrawerToolCallPart,
  approved: boolean
): void {
  const interrupt = interrupts?.find(
    (item) => item.kind === 'tool-approval' && item.toolCallId === call.id
  )
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve === 'function') resolve.call(interrupt, approved)
}
