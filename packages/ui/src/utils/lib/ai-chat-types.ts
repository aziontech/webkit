import type {
  ActivityPart,
  AudioPart,
  BatchInterruptError,
  ContentPart,
  ContentPartDataSource,
  ContentPartSource,
  DocumentPart,
  ImagePart,
  MessagePart,
  StructuredOutputPart,
  SubagentPart,
  SubagentStatus,
  TextPart,
  ThinkingPart,
  ToolCallPart,
  ToolCallState,
  ToolResultPart,
  UIMessage,
  UIResourcePart,
  VideoPart
} from '@tanstack/ai'

import type { AgentActivityStep } from '../../components/ai/agent-activity/agent-activity.vue'
import type {
  AgentQuestionOption,
  AgentQuestionStatus
} from '../../components/ai/agent-question/agent-question.vue'
import type { SourcesItem } from '../../components/ai/sources/sources.vue'
import type { ToolApprovalVariant } from '../../components/ai/tool-approval/tool-approval.vue'
import type { ImageGalleryItem } from '../../components/content/image-gallery/image-gallery.vue'

/** Who wrote a message; the conversation draws the reader's and the assistant's. */
export type AiChatRole = UIMessage['role']

/** Text of a message: plain for the reader, Markdown for the assistant. */
export type AiChatTextPart = TextPart

/** How the assistant reached the answer, shown in the collapsible Reasoning. */
export type AiChatThinkingPart = ThinkingPart

/** Where a tool call stands. */
export type AiChatToolCallState = ToolCallState

/** A tool the assistant calls; one that needs approval carries `approval`. */
export type AiChatToolCallPart = ToolCallPart

/** What a tool returned, matched to its call by `toolCallId`. */
export type AiChatToolResultPart = ToolResultPart

/** Where the bytes of an image, audio, video or document come from: a URL, base64 data, or a provider file the block cannot draw. */
export type AiChatMediaSource = ContentPartSource

/** An image the message carries; consecutive images draw as one gallery. */
export type AiChatImagePart = ImagePart

/** An audio clip the message carries. */
export type AiChatAudioPart = AudioPart

/** A video the message carries. */
export type AiChatVideoPart = VideoPart

/** A document the message carries, such as a PDF; `metadata.name` names it. */
export type AiChatDocumentPart = DocumentPart

/** A step the agent reports; `content.title`, `content.status` and `content.detail` draw it. */
export type AiChatActivityPart = ActivityPart

/** Where a helper agent stands. */
export type AiChatSubagentStatus = SubagentStatus

/** A helper agent the assistant started, with its own messages; `useChat` adds `stop` and `input` to the card. */
export type AiChatSubagentPart = SubagentPart & {
  subagent: {
    /** Stops the helper agent. */
    stop?: () => void
    /** What the parent model wrote when it started the helper agent. */
    input?: unknown
  }
}

/** An interactive widget a tool returned (an MCP app), drawn in a sandboxed frame. */
export type AiChatUiResourcePart = UIResourcePart

/** A typed answer the assistant returned against a schema; `data` is set once it is complete. */
export type AiChatStructuredOutputPart = StructuredOutputPart

/** One piece of a message, in the order it arrived. */
export type AiChatPart = Exclude<MessagePart, SubagentPart> | AiChatSubagentPart

/** What the app adds to a message beside its parts. */
export interface AiChatMessageMetadata {
  /** The documents the response cites, numbered in order. */
  sources?: SourcesItem[]
  /** How long the assistant thought, in seconds; left out, the block measures it while it streams. */
  reasoningSeconds?: number
  /** The reader stopped this response; the block also marks the response Stop ends. */
  stopped?: boolean
}

/** One message, TanStack AI's `UIMessage` as `useChat` returns it, with the metadata the block reads typed. */
export type AiChatMessage = Omit<UIMessage, 'parts' | 'metadata'> & {
  /** The text, reasoning and tool calls, in order. */
  parts: ReadonlyArray<AiChatPart>
  /** Sources, the thinking time and the stopped flag, beside TanStack's own keys. */
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
  /** The reader answers this tool in the chat: the block asks `question` (else the title) and hands the answer back for `addToolResult`. */
  answerable?: boolean
  /** The answers the reader picks from when `answerable`; left out, the reader types one. */
  options?: AgentQuestionOption[]
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

/** A failed attempt to send the answers to pending requests: the part of TanStack AI's `BatchInterruptError` the block reads. */
export type AiChatInterruptError = Pick<BatchInterruptError, 'message'> &
  Partial<Pick<BatchInterruptError, 'retryable' | 'code'>>

/** The answer to a tool the reader answers, in the shape `addToolResult` takes. */
export interface AiChatToolAnswer {
  toolCallId: string
  tool: string
  output: unknown
}

/** Inline base64 bytes of a file the reader attached. */
export type AiChatDataSource = ContentPartDataSource

/** A file the reader attached to a message, as a TanStack AI content part with inline data and a name. */
export type AiChatAttachment = Exclude<ContentPart, TextPart> & {
  source: AiChatDataSource
  metadata: { name: string }
}

/** A message with attachments, as `sendMessage` takes it. */
export interface AiChatContent {
  content: Array<AiChatTextPart | AiChatAttachment>
}

/** What the reader sent: the text alone, or the text with its attachments. */
export type AiChatSendContent = string | AiChatContent

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
  bound: boolean
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
  | { type: 'structured'; key: string; part: AiChatStructuredOutputPart }
