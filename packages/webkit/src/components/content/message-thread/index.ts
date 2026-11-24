import MessageThread from './message-thread.vue'
import MessageThreadGroup from './message-thread-group/message-thread-group.vue'
import MessageThreadItem from './message-thread-item/message-thread-item.vue'

type CompoundMessageThread = typeof MessageThread & {
  Item: typeof MessageThreadItem
  Group: typeof MessageThreadGroup
}

const MessageThreadRoot = Object.assign(MessageThread, {
  Item: MessageThreadItem,
  Group: MessageThreadGroup
}) as CompoundMessageThread

export default MessageThreadRoot
export { MessageThreadGroup, MessageThreadItem }
export { useMessageThreadContext } from './composables/use-message-thread-context'
export type { MessageThreadContext } from './injection-key'
export type { MessageThreadProps } from './message-thread.vue'
export type { MessageThreadGroupProps } from './message-thread-group/message-thread-group.vue'
export type {
  MessageThreadChannel,
  MessageThreadFrom,
  MessageThreadItemProps,
  MessageThreadItemType
} from './message-thread-item/message-thread-item.vue'
