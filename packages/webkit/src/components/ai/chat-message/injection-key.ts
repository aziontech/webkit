import type { ComputedRef, InjectionKey } from 'vue'

/** Who wrote the message. */
export type ChatMessageFrom = 'user' | 'assistant' | 'system'

/** Where the message is in its life: waiting for the first token, streaming, done, or failed. */
export type ChatMessageState = 'pending' | 'streaming' | 'complete' | 'error'

/** The thumb a reader chose on a response. */
export type ChatMessageFeedbackValue = 'up' | 'down'

export interface ChatMessageContext {
  /** Who wrote the message. */
  from: ComputedRef<ChatMessageFrom>
  /** Lifecycle of the message; actions render only when it is complete. */
  state: ComputedRef<ChatMessageState>
}

export const ChatMessageInjectionKey: InjectionKey<ChatMessageContext> = Symbol('ChatMessage')
