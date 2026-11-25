import { nextTick, onMounted, onScopeDispose, readonly, type Ref, ref, watch } from 'vue'

import { autosize } from '../lib/autosize'

export interface UsePromptInputAutosizeReturn {
  multiline: Readonly<Ref<boolean>>
}

export function usePromptInputAutosize(
  textareaEl: Readonly<Ref<HTMLTextAreaElement | null>>,
  model: Readonly<Ref<string>>,
  minRows: () => number,
  maxRows: () => number,
  layout: () => unknown
): UsePromptInputAutosizeReturn {
  const multiline = ref<boolean>(false)
  let width = -1
  const resize = (): void => {
    if (!textareaEl.value || typeof window === 'undefined') return
    const tall = autosize(textareaEl.value, minRows(), maxRows())
    if (!model.value) multiline.value = false
    else if (tall || model.value.includes('\n')) multiline.value = true
  }
  watch(
    () => [model.value, minRows(), maxRows(), layout(), multiline.value],
    () => void nextTick(resize)
  )
  const observer =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries) => {
          const next = entries[0]?.contentRect.width ?? 0
          if (next === width) return
          width = next
          resize()
        })
  watch(textareaEl, (el, old) => {
    if (old) observer?.unobserve(old)
    if (el) observer?.observe(el)
  })
  let frame = 0
  onScopeDispose(() => {
    observer?.disconnect()
    if (frame) cancelAnimationFrame(frame)
  })
  onMounted(() => {
    if (!observer) frame = requestAnimationFrame(resize)
  })
  return { multiline: readonly(multiline) }
}
