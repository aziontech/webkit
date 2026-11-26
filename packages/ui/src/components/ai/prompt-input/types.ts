import type { FileTokenGroupItem } from '../../input/file-token-group/file-token-group.vue'

export type PromptInputStatus = 'ready' | 'pending' | 'streaming'

export interface PromptInputMenuOption {
  value: string
  label: string
  description?: string
  icon?: string
  provider?: string
  shortcut?: string
}

export interface PromptInputMenu {
  trigger: string
  label: string
  options: PromptInputMenuOption[]
}

export interface PromptInputReference {
  trigger: string
  value: string
  label: string
}

/** An attached file with the upload state the owner sets on it. */
export type PromptInputFile = FileTokenGroupItem

/** Why picked, dropped or pasted files were not attached. */
export type PromptInputRejectReason = 'accept' | 'max-files' | 'max-file-size'
