import { inject, provide } from 'vue'

import {
  type ConversationHistoryContext,
  ConversationHistoryInjectionKey,
  type ConversationHistoryMenuEvent
} from '../injection-key'
import type {
  ConversationHistoryItem,
  ConversationHistoryMovePayload,
  ConversationHistoryProject,
  ConversationHistoryRenamePayload
} from '../lib/types'

type MenuEvent = ConversationHistoryMenuEvent

type Item = ConversationHistoryItem
type Project = ConversationHistoryProject

export interface ConversationHistoryEmit {
  (event: 'remove', payload: MenuEvent, id: string): void
  (event: 'item-pin', payload: MenuEvent, item: Item): void
  (event: 'item-share', payload: MenuEvent, item: Item): void
  (event: 'item-lock', payload: MenuEvent, item: Item): void
  (event: 'item-archive', payload: MenuEvent, item: Item): void
  (
    event: 'item-rename',
    payload: KeyboardEvent | FocusEvent,
    value: ConversationHistoryRenamePayload
  ): void
  (event: 'item-move', payload: MenuEvent, value: ConversationHistoryMovePayload): void
  (event: 'project-pin', payload: MenuEvent, project: Project): void
  (event: 'project-settings-open', payload: MenuEvent, project: Project): void
  (event: 'project-remove', payload: MenuEvent, project: Project): void
  (event: 'project-chat-create', payload: MouseEvent, project: Project): void
}

export type ProvideConversationHistoryContextOptions = Omit<
  ConversationHistoryContext,
  'saveRename' | 'remove' | 'act' | 'actProject'
> & {
  emit: ConversationHistoryEmit
  track: (origin: Event | Element | null, id: string) => void
}

const itemAct = (
  emit: ConversationHistoryEmit,
  event: MenuEvent,
  action: 'pin' | 'share' | 'lock' | 'archive',
  item: Item
): void => {
  if (action === 'pin') emit('item-pin', event, item)
  else if (action === 'share') emit('item-share', event, item)
  else if (action === 'lock') emit('item-lock', event, item)
  else emit('item-archive', event, item)
}

const projectAct = (
  emit: ConversationHistoryEmit,
  event: MenuEvent,
  action: 'pin' | 'settings' | 'remove' | 'chat-create',
  project: Project
): void => {
  if (action === 'pin') emit('project-pin', event, project)
  else if (action === 'settings') emit('project-settings-open', event, project)
  else if (action === 'remove') emit('project-remove', event, project)
  else if (event instanceof MouseEvent) emit('project-chat-create', event, project)
}

export function provideConversationHistoryContext(
  options: ProvideConversationHistoryContextOptions
): ConversationHistoryContext {
  const { emit, track, ...shared } = options
  const context: ConversationHistoryContext = {
    ...shared,
    saveRename: (event, item, title) => emit('item-rename', event, { item, title }),
    remove: (event, id, origin) => {
      track(origin ?? event, id)
      emit('remove', event, id)
    },
    act: (event, action, item, project) => {
      if (action === 'rename') shared.startRename(item.id)
      else if (action === 'move') {
        if (project) emit('item-move', event, { item, project })
      } else itemAct(emit, event, action, item)
    },
    actProject: (event, action, project) => projectAct(emit, event, action, project)
  }
  provide(ConversationHistoryInjectionKey, context)
  return context
}

export function useConversationHistoryContext(): ConversationHistoryContext {
  const ctx = inject(ConversationHistoryInjectionKey, null)
  if (!ctx)
    throw new Error('useConversationHistoryContext must be used within <ConversationHistory>.')
  return ctx
}
