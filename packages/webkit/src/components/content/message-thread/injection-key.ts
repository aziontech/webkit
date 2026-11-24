import type { ComputedRef, InjectionKey } from 'vue'

import type { TimestampFormat } from '../timestamp/timestamp.vue'

export interface MessageThreadContext {
  /** How every item's sent time reads, from the root's `timestampFormat`. */
  timestampFormat: ComputedRef<TimestampFormat>
}

export const MessageThreadInjectionKey: InjectionKey<MessageThreadContext> = Symbol('MessageThread')
