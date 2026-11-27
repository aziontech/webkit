import { nextTick, type Ref } from 'vue'

export const lineList = (lines: number[]): string =>
  lines.length === 1
    ? `Line ${lines[0]} is`
    : `Lines ${lines.slice(0, -1).join(', ')} and ${lines.at(-1)} are`

export const closePastePanel = async (
  open: Ref<boolean>,
  toggle: Ref<{ $el?: HTMLElement } | null>
): Promise<void> => {
  open.value = false
  await nextTick()
  toggle.value?.$el?.focus()
}
