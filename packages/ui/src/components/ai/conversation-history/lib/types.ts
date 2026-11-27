/** Outcome of a chat's last run: running shows a spinner, error a danger mark. */
export type ConversationHistoryStatus = 'running' | 'success' | 'error'

/** A row action offered on every chat. */
export type ConversationHistoryItemAction = 'pin' | 'rename' | 'share' | 'lock' | 'move' | 'archive'

/** A row action offered on every project. */
export type ConversationHistoryProjectAction = 'pin' | 'settings' | 'remove' | 'chat-create'

/** How the chats outside projects are grouped: by last activity, or by status. */
export type ConversationHistoryGroupBy = 'date' | 'status'

/** A collapsible section whose open state lives in v-model:openSectionKeys. */
export type ConversationHistorySection = 'recents' | 'working' | 'settled'

/** Order of the projects: by their newest conversation, or by name. */
export type ConversationHistoryProjectSort = 'recent' | 'name'

export interface ConversationHistoryItem {
  /** Id of the conversation, the value of v-model while it is open. */
  id: string
  /** Title of the conversation. */
  title: string
  /** Time of the last message; it sets the date group, the order and the age. */
  updatedAt: string | number | Date
  /** Id of the project the conversation belongs to; it then shows under that project instead of in Recents. */
  projectId?: string
  /** Shows the conversation in the Pinned group on top. */
  pinned?: boolean
  /** Hides the conversation from the date groups; grouped by status it shows under Settled. */
  archived?: boolean
  /** Shows a lock glyph; the menu offers Unlock. */
  locked?: boolean
  /** Outcome of the last run: running shows a spinner and the Working group, error a danger mark. */
  status?: ConversationHistoryStatus
  /** Short text shown as a tag before the title. */
  tag?: string
  /** Second line under the title, such as a branch or a project name. */
  description?: string
}

export interface ConversationHistoryProject {
  /** Id of the project, the key in v-model:openKeys. */
  id: string
  /** Name of the project. */
  title: string
  /** Lists the project first. */
  pinned?: boolean
}

/** Payload of item-rename. */
export interface ConversationHistoryRenamePayload {
  /** The conversation renamed. */
  item: ConversationHistoryItem
  /** The new title, trimmed. */
  title: string
}

/** Payload of item-move. */
export interface ConversationHistoryMovePayload {
  /** The conversation moved. */
  item: ConversationHistoryItem
  /** The project it moves to. */
  project: ConversationHistoryProject
}
