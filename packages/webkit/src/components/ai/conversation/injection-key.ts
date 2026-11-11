import type { ComputedRef, InjectionKey, Ref } from 'vue'

/** `split`: the user's messages sit at the inline end; `start`: every message sits at the inline start (dense panels and drawers). */
export type ConversationAlignment = 'split' | 'start'

export interface ConversationContext {
  /** Where messages sit; read by every `ChatMessage` inside the conversation. */
  alignment: ComputedRef<ConversationAlignment>
  /** True once the conversation has mounted; messages mounted after it are new and get announced. */
  ready: Ref<boolean>
  /** Reads a finished message to screen readers through the conversation's polite live region. */
  announce: (author: string, text: string) => void
}

export const ConversationInjectionKey: InjectionKey<ConversationContext> = Symbol('Conversation')
