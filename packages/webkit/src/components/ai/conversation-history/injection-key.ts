import type { ComputedRef, InjectionKey, Ref, Slots } from 'vue'

import type { MessageKey, MessageParams } from '../../../i18n/types'
import type {
  ConversationHistoryItem,
  ConversationHistoryItemAction,
  ConversationHistoryProject,
  ConversationHistoryProjectAction
} from './lib/types'

export type ConversationHistoryMenuEvent = MouseEvent | KeyboardEvent

/** What the rows of one ConversationHistory share; provided by the root, read by its private parts. */
export interface ConversationHistoryContext {
  testId: ComputedRef<string>
  active: Readonly<Ref<string | null>>
  itemActions: ComputedRef<readonly ConversationHistoryItemAction[]>
  projectActions: ComputedRef<readonly ConversationHistoryProjectAction[]>
  removable: ComputedRef<boolean>
  showTime: ComputedRef<boolean>
  projects: ComputedRef<readonly ConversationHistoryProject[]>
  now: ComputedRef<number>
  locale: ComputedRef<string>
  renamingId: Readonly<Ref<string | null>>
  slots: Slots
  t: (key: MessageKey, params?: MessageParams) => string
  select: (id: string) => void
  startRename: (id: string | null) => void
  saveRename: (
    event: KeyboardEvent | FocusEvent,
    item: ConversationHistoryItem,
    title: string
  ) => void
  remove: (event: ConversationHistoryMenuEvent, id: string, origin: Element | null) => void
  act: (
    event: ConversationHistoryMenuEvent,
    action: ConversationHistoryItemAction,
    item: ConversationHistoryItem,
    project?: ConversationHistoryProject
  ) => void
  actProject: (
    event: ConversationHistoryMenuEvent,
    action: ConversationHistoryProjectAction,
    project: ConversationHistoryProject
  ) => void
}

export const ConversationHistoryInjectionKey: InjectionKey<ConversationHistoryContext> =
  Symbol('ConversationHistory')
