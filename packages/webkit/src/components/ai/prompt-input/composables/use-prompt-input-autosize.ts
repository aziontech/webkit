import { nextTick, onMounted, type Ref, watch } from 'vue'

import { autosize } from '../lib/autosize'

export function usePromptInputAutosize(
  textareaEl: Readonly<Ref<HTMLTextAreaElement | null>>,
  model: Readonly<Ref<string>>,
  minRows: () => number,
  maxRows: () => number
): void {
  const resize = (): void => {
    if (textareaEl.value && typeof window !== 'undefined')
      autosize(textareaEl.value, minRows(), maxRows())
  }
  watch(
    () => [model.value, minRows(), maxRows()],
    () => void nextTick(resize)
  )
  onMounted(resize)
}
