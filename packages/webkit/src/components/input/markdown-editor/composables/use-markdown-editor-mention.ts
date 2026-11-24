import { computed, type ComputedRef, readonly, type Ref, ref } from 'vue'

import {
  filterOptions,
  findQuery,
  type PromptInputQuery
} from '../../../ai/prompt-input/composables/use-prompt-input-menu'
import { applyEdit } from '../lib/markdown-format'

/** A person the mention menu offers after the at sign. */
export interface MarkdownEditorMention {
  /** Handle inserted after the at sign; no spaces (`jane.doe`). */
  value: string
  /** Name shown in the menu. */
  label: string
  /** Second line of the option, such as the email address. */
  description?: string
  /** Azion icon class shown before the name. */
  icon?: string
}

export type MarkdownEditorPickEvent = MouseEvent | KeyboardEvent

export interface UseMarkdownEditorMentionOptions {
  field: () => HTMLTextAreaElement | null
  mentions: () => MarkdownEditorMention[]
  enabled: () => boolean
  onPick: (event: MarkdownEditorPickEvent, mention: MarkdownEditorMention) => void
}

export interface UseMarkdownEditorMentionReturn {
  matches: ComputedRef<MarkdownEditorMention[]>
  open: ComputedRef<boolean>
  activeIndex: Readonly<Ref<number>>
  setActiveIndex: (index: number) => void
  readQuery: () => void
  close: () => void
  pick: (event: MarkdownEditorPickEvent, mention: MarkdownEditorMention) => void
  onKeydown: (event: KeyboardEvent) => boolean
}

export function useMarkdownEditorMention(
  options: UseMarkdownEditorMentionOptions
): UseMarkdownEditorMentionReturn {
  const query = ref<PromptInputQuery | null>(null)
  const activeIndex = ref(0)

  const matches = computed<MarkdownEditorMention[]>(() => filterOptions(query.value))
  const open = computed<boolean>(() => !!query.value && matches.value.length > 0)

  const setActiveIndex = (index: number): void => {
    activeIndex.value = index
  }

  const close = (): void => {
    query.value = null
  }

  function readQuery(): void {
    const field = options.field()
    const mentions = options.mentions()
    const next =
      field && options.enabled() && mentions.length
        ? findQuery(field, [{ trigger: '@', label: '', options: mentions }])
        : null
    if (next?.text !== query.value?.text) activeIndex.value = 0
    query.value = next
  }

  function pick(event: MarkdownEditorPickEvent, mention: MarkdownEditorMention): void {
    const field = options.field()
    const current = query.value
    if (!field || !current) return
    const text = `@${mention.value} `
    const caret = current.start + text.length
    query.value = null
    applyEdit(field, {
      from: current.start,
      to: field.selectionStart ?? field.value.length,
      text,
      selectStart: caret,
      selectEnd: caret
    })
    options.onPick(event, mention)
  }

  function onKeydown(event: KeyboardEvent): boolean {
    if (!open.value) return false
    const count = matches.value.length
    const { key } = event
    if (key === 'ArrowDown' || key === 'ArrowUp')
      activeIndex.value = (activeIndex.value + (key === 'ArrowDown' ? 1 : count - 1)) % count
    else if ((key === 'Enter' || key === 'Tab') && !event.isComposing)
      pick(event, matches.value[Math.min(activeIndex.value, count - 1)]!)
    else if (key === 'Escape') {
      close()
      event.stopPropagation()
    } else return false
    event.preventDefault()
    return true
  }

  return {
    matches,
    open,
    activeIndex: readonly(activeIndex),
    setActiveIndex,
    readQuery,
    close,
    pick,
    onKeydown
  }
}
