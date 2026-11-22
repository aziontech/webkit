import { nextTick, onMounted, readonly, type Ref, ref, watch } from 'vue'

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
  onMounted(resize)
  return { multiline: readonly(multiline) }
}
