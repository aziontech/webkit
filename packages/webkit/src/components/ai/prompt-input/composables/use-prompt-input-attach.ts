import { computed, provide, type Ref, shallowRef } from 'vue'

import { useElementListener } from '../../../../composables/use-element-listener'
import type { PromptInputAttachHandlers } from '../injection-key'
import { PromptInputInjectionKey } from '../injection-key'
import type { PromptInputFile, PromptInputRejectReason } from '../types'

const DRAG_EVENTS = ['dragenter', 'dragover', 'dragleave', 'drop'] as const

export interface UsePromptInputAttachOptions {
  boxEl: Readonly<Ref<HTMLElement | null>>
  disabled: () => boolean
  accept: () => string
  maxFiles: () => number
  maxFileSize: () => number
  model: Ref<string>
  files: Ref<PromptInputFile[]>
  dragging: Ref<boolean>
  rejection: Ref<string>
  reject: (event: Event, files: File[], reason: PromptInputRejectReason) => void
  focus: () => void
}

export interface UsePromptInputAttachReturn {
  paste: (event: ClipboardEvent) => void
}

export function usePromptInputAttach(
  options: UsePromptInputAttachOptions
): UsePromptInputAttachReturn {
  const { model, files, dragging, rejection } = options
  const attach = shallowRef<PromptInputAttachHandlers | null>(null)
  const onDrag = (event: DragEvent): void => attach.value?.drag(event)
  for (const type of DRAG_EVENTS) useElementListener(options.boxEl, type, onDrag)

  provide(PromptInputInjectionKey, {
    disabled: computed(options.disabled),
    accept: computed(options.accept),
    maxFiles: computed(options.maxFiles),
    getText: () => model.value,
    setText: (value: string) => {
      model.value = value
    },
    maxFileSize: computed(options.maxFileSize),
    fileCount: computed(() => files.value.length),
    appendFiles: (added: File[]) => {
      files.value = [...files.value, ...added.map((file) => ({ file }))]
    },
    reject: options.reject,
    setRejection: (message: string) => {
      rejection.value = message
    },
    setDragging: (value: boolean) => {
      dragging.value = value
    },
    registerAttach: (handlers: PromptInputAttachHandlers) => {
      attach.value = handlers
      return () => {
        if (attach.value === handlers) attach.value = null
        dragging.value = false
      }
    },
    focus: options.focus
  })

  return { paste: (event) => attach.value?.paste(event) }
}
