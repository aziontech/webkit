import ChatMessage from './chat-message.vue'
import ChatMessageActions from './chat-message-actions/chat-message-actions.vue'
import ChatMessageFeedback from './chat-message-feedback/chat-message-feedback.vue'

type CompoundChatMessage = typeof ChatMessage & {
  Actions: typeof ChatMessageActions
  Feedback: typeof ChatMessageFeedback
}

const ChatMessageRoot = Object.assign(ChatMessage, {
  Actions: ChatMessageActions,
  Feedback: ChatMessageFeedback
}) as CompoundChatMessage

export default ChatMessageRoot
export { ChatMessageActions, ChatMessageFeedback }
export type { ChatMessageFeedbackValue, ChatMessageFrom, ChatMessageState } from './injection-key'
