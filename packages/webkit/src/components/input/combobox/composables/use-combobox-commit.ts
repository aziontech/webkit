import type { Ref } from 'vue'

import { type ComboboxRow, optionLabel } from '../lib/combobox-rows'
import type { ComboboxOption } from '../types'

type CommitEvent = MouseEvent | KeyboardEvent | FocusEvent

export interface UseComboboxCommitReturn {
  commitRow: (event: CommitEvent, row: ComboboxRow) => void
  commitText: (event: CommitEvent) => void
  restore: () => void
  reset: () => void
}

export function useComboboxCommit(
  model: Ref<string>,
  text: Ref<string>,
  typing: Ref<boolean>,
  props: { allowCustom: boolean },
  exactMatch: (value: string) => ComboboxOption | undefined,
  displayOf: (value: string) => string,
  close: () => void,
  onCreate: (event: CommitEvent, value: string) => void
): UseComboboxCommitReturn {
  const setModel = (value: string) => {
    if (value !== model.value) model.value = value
  }

  const commitOption = (option: ComboboxOption) => {
    if (option.disabled) return
    typing.value = false
    text.value = optionLabel(option)
    setModel(option.value)
    close()
  }

  const commitCustom = (event: CommitEvent, value: string) => {
    typing.value = false
    text.value = value
    if (value !== model.value) {
      setModel(value)
      onCreate(event, value)
    }
    close()
  }

  const commitRow = (event: CommitEvent, row: ComboboxRow) => {
    if (row.kind === 'option') commitOption(row.option)
    else commitCustom(event, row.value)
  }

  const restore = () => {
    typing.value = false
    text.value = displayOf(model.value)
  }

  const reset = () => {
    typing.value = false
    text.value = ''
    setModel('')
  }

  const commitText = (event: CommitEvent) => {
    if (!typing.value) return
    const value = text.value.trim()
    if (!value) return reset()
    const match = exactMatch(value)
    if (match) commitOption(match)
    else if (props.allowCustom) commitCustom(event, value)
    else restore()
  }

  return { commitRow, commitText, restore, reset }
}
