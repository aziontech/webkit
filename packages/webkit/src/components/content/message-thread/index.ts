import MessageThread from './message-thread.vue'
import MessageThreadGroup from './message-thread-group/message-thread-group.vue'
import MessageThreadItem from './message-thread-item/message-thread-item.vue'

const MessageThreadRoot = Object.assign(MessageThread, {
  Item: MessageThreadItem,
  Group: MessageThreadGroup
})

export default MessageThreadRoot
export { MessageThreadGroup, MessageThreadItem }
export type { TimestampFormat } from '../timestamp/timestamp.vue'
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
