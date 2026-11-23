import type { ComputedRef, InjectionKey } from 'vue'

/** Who wrote the message. */
export type ChatMessageFrom = 'user' | 'assistant' | 'system'

/** Where the message is in its life: waiting for the first token, streaming, done, or failed. */
export type ChatMessageStatus = 'pending' | 'streaming' | 'success' | 'error'

/** The thumb a reader chose on a response. */
export type ChatMessageFeedbackValue = 'up' | 'down'

export interface ChatMessageContext {
  /** Who wrote the message. */
  from: ComputedRef<ChatMessageFrom>
  /** Lifecycle of the message; actions render only when it is `success`. */
  status: ComputedRef<ChatMessageStatus>
  /** A user message is open for editing; its actions are hidden meanwhile. */
  editing: ComputedRef<boolean>
  /** Opens a user message for editing; does nothing on other messages. */
  edit: () => void
  /** Reads the text of the rendered content, what Read aloud speaks when it is given no text. */
  contentText: () => string
}

export const ChatMessageInjectionKey: InjectionKey<ChatMessageContext> = Symbol('ChatMessage')
