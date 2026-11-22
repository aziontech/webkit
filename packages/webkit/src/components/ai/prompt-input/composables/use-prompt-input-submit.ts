import { computed, type ComputedRef, nextTick, type Ref, watch } from 'vue'

import { referenceToken } from '../lib/references'
import type { PromptInputFile, PromptInputReference, PromptInputStatus } from '../types'

export interface PromptInputSubmitPayload {
  value: string
  references: PromptInputReference[]
  files: PromptInputFile[]
}

export interface UsePromptInputSubmitOptions {
  model: Ref<string>
  files: Ref<PromptInputFile[]>
  references: Ref<PromptInputReference[]>
  rejection: Ref<string>
  controlEl: Readonly<Ref<HTMLElement | null>>
  maxLength: () => number
  status: () => PromptInputStatus
  disabled: () => boolean
  queueable: () => boolean
  voice: () => boolean
  focus: () => void
  send: (event: MouseEvent | KeyboardEvent, payload: PromptInputSubmitPayload) => void
}

export interface UsePromptInputSubmitReturn {
  overBy: ComputedRef<number>
  nearLimit: ComputedRef<boolean>
  busy: ComputedRef<boolean>
  canSubmit: ComputedRef<boolean>
  showVoice: ComputedRef<boolean>
  submit: (event: MouseEvent | KeyboardEvent) => void
}

function restoreFocus(controlEl: HTMLElement | null, focus: () => void): void {
  if (typeof document === 'undefined' || !controlEl?.contains(document.activeElement)) return
  void nextTick(() => {
    const active = document.activeElement as HTMLButtonElement | null
    if (!active || active === document.body || active.disabled) focus()
  })
}

export function usePromptInputSubmit(
  options: UsePromptInputSubmitOptions
): UsePromptInputSubmitReturn {
  const { model, files, references, rejection } = options
  const overBy = computed<number>(() =>
    options.maxLength() > 0 ? Math.max(0, model.value.length - options.maxLength()) : 0
  )
  const nearLimit = computed<boolean>(
    () => options.maxLength() > 0 && model.value.length >= options.maxLength() * 0.8
  )
  const busy = computed<boolean>(() => options.status() !== 'ready')
  const filesPending = computed<boolean>(() =>
    files.value.some((item) => item.loading || !!item.error)
  )
  const hasContent = computed<boolean>(
    () => model.value.trim().length > 0 || files.value.length > 0
  )
  const canSubmit = computed<boolean>(
    () =>
      !options.disabled() &&
      (!busy.value || options.queueable()) &&
      overBy.value === 0 &&
      hasContent.value &&
      !filesPending.value
  )
  const showVoice = computed<boolean>(() => options.voice() && !busy.value && !hasContent.value)
  const control = computed<string>(() => {
    if (busy.value) return options.queueable() && canSubmit.value ? 'stop-submit' : 'stop'
    if (showVoice.value) return 'voice'
    return canSubmit.value ? 'submit' : 'submit-off'
  })
  watch(control, () => restoreFocus(options.controlEl.value, options.focus))

  function submit(event: MouseEvent | KeyboardEvent): void {
    if (!canSubmit.value) return
    const text = model.value.trim()
    rejection.value = ''
    options.send(event, {
      value: text,
      references: references.value.filter((reference) => text.includes(referenceToken(reference))),
      files: files.value
    })
  }

  return { overBy, nearLimit, busy, canSubmit, showVoice, submit }
}
