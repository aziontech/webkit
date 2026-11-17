import type { ComputedRef, InjectionKey } from 'vue'

import type { PromptInputRejectReason } from './prompt-input.vue'

export interface PromptInputAttachHandlers {
  /** Handles every drag event over the box: dragenter, dragover, dragleave and drop. */
  drag: (event: DragEvent) => void
  /** Handles a paste in the text area. */
  paste: (event: ClipboardEvent) => void
}

export interface PromptInputContext {
  /** Whether the composer is disabled; every part disables with it. */
  disabled: ComputedRef<boolean>
  /** File filter for picked, dropped and pasted files. */
  accept: ComputedRef<string>
  /** Most files attached at once; `0` means no limit. */
  maxFiles: ComputedRef<number>
  /** Largest file in bytes; `0` means no limit. */
  maxFileSize: ComputedRef<number>
  /** How many files are attached. */
  fileCount: ComputedRef<number>
  /** Reads the prompt being written. */
  getText: () => string
  /** Replaces the prompt being written. */
  setText: (value: string) => void
  /** Appends accepted files to the attached files. */
  appendFiles: (files: File[]) => void
  /** Emits the root reject event for files that were not attached. */
  reject: (event: Event, files: File[], reason: PromptInputRejectReason) => void
  /** Shows why files were not attached, under the box; empty clears it. */
  setRejection: (message: string) => void
  /** Shows or hides the drop panel over the box. */
  setDragging: (value: boolean) => void
  /** Hands the box's drag and paste events to the attach control; returns the function that takes them back. */
  registerAttach: (handlers: PromptInputAttachHandlers) => () => void
  /** Moves focus to the text area. */
  focus: () => void
}

export const PromptInputInjectionKey: InjectionKey<PromptInputContext> = Symbol('PromptInput')
