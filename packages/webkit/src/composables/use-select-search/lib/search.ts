import type { SelectSearchItem } from '../use-select-search'

const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const matches = (item: SelectSearchItem, term: string) => {
  const text = normalize(item.text)
  return (
    text.startsWith(term) ||
    text.includes(` ${term}`) ||
    (item.keywords ?? []).some((keyword) => normalize(keyword).startsWith(term))
  )
}

export const isPrintable = (event: KeyboardEvent): boolean =>
  event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey

export function filterItems(items: SelectSearchItem[], query: string): SelectSearchItem[] {
  const term = normalize(query)
  return term ? items.filter((item) => matches(item, term)) : items
}

export function nextEnabledIndex(items: SelectSearchItem[], from: number, step: 1 | -1): number {
  for (let i = 1; i <= items.length; i++) {
    const index = (((from + step * i) % items.length) + items.length) % items.length
    if (!items[index].disabled) return index
  }
  return -1
}

export function focusById(id: string): void {
  document.getElementById(id)?.focus()
}
