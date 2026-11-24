import { computed, type ComputedRef, nextTick, type Ref } from 'vue'

import type { PromptInputMenu, PromptInputMenuOption, PromptInputReference } from '../types'

const MAX_OPTIONS = 8

export interface PromptInputQuery {
  menu: PromptInputMenu
  start: number
  text: string
}

export interface UsePromptInputMenuReturn {
  matches: ComputedRef<PromptInputMenuOption[]>
  menuOpen: ComputedRef<boolean>
  readQuery: () => void
  choose: (option: PromptInputMenuOption) => void
  onMenuKeydown: (event: KeyboardEvent) => boolean
}

export function findQuery(
  el: HTMLTextAreaElement,
  menus: PromptInputMenu[]
): PromptInputQuery | null {
  const text = el.value
  const caret = el.selectionStart ?? text.length
  const token = /(^|\s)(\S*)$/.exec(text.slice(0, caret))?.[2] ?? ''
  const menu = menus.find((candidate) => token.startsWith(candidate.trigger))
  if (!menu || el.selectionStart !== el.selectionEnd) return null
  return { menu, start: caret - token.length, text: token.slice(menu.trigger.length) }
}

export function filterOptions(current: PromptInputQuery | null): PromptInputMenuOption[] {
  if (!current) return []
  const needle = current.text.toLocaleLowerCase()
  return current.menu.options
    .filter(
      (option) =>
        option.label.toLocaleLowerCase().includes(needle) ||
        option.value.toLocaleLowerCase().includes(needle)
    )
    .slice(0, MAX_OPTIONS)
}

function withReference(
  references: PromptInputReference[],
  trigger: string,
  option: PromptInputMenuOption
): PromptInputReference[] {
  if (
    references.some(
      (reference) => reference.trigger === trigger && reference.value === option.value
    )
  )
    return references
  return [...references, { trigger, value: option.value, label: option.label }]
}

export function usePromptInputMenu(
  textareaEl: Readonly<Ref<HTMLTextAreaElement | null>>,
  menus: () => PromptInputMenu[],
  model: Ref<string>,
  references: Ref<PromptInputReference[]>,
  query: Ref<PromptInputQuery | null>,
  activeIndex: Ref<number>
): UsePromptInputMenuReturn {
  const matches = computed<PromptInputMenuOption[]>(() => filterOptions(query.value))
  const menuOpen = computed<boolean>(() => !!query.value && matches.value.length > 0)

  function readQuery(): void {
    const el = textareaEl.value
    const next = el && menus().length ? findQuery(el, menus()) : null
    if (next && (query.value?.menu !== next.menu || query.value.text !== next.text))
      activeIndex.value = 0
    query.value = next
  }

  function choose(option: PromptInputMenuOption): void {
    const current = query.value
    const el = textareaEl.value
    if (!current || !el) return
    const text = el.value
    const inserted = `${current.menu.trigger}${option.label} `
    const next =
      text.slice(0, current.start) + inserted + text.slice(el.selectionStart ?? text.length)
    el.value = next
    model.value = next
    references.value = withReference(references.value, current.menu.trigger, option)
    query.value = null
    const position = current.start + inserted.length
    void nextTick(() => {
      el.focus()
      el.setSelectionRange(position, position)
    })
  }

  function onMenuKeydown(event: KeyboardEvent): boolean {
    const count = matches.value.length
    const { key } = event
    if (!menuOpen.value) return false
    if (key === 'ArrowDown' || key === 'ArrowUp')
      activeIndex.value = (activeIndex.value + (key === 'ArrowDown' ? 1 : count - 1)) % count
    else if ((key === 'Enter' || key === 'Tab') && !event.isComposing)
      choose(matches.value[Math.min(activeIndex.value, count - 1)]!)
    else if (key === 'Escape') query.value = null
    else return false
    event.preventDefault()
    return true
  }

  return { matches, menuOpen, readQuery, choose, onMenuKeydown }
}
