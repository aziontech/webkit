import { nextTick, type Ref } from 'vue'

import type { ToastEntry } from '../composables/use-toast-store'

const sentence = (parts: (string | undefined)[]) =>
  parts
    .filter((part): part is string => !!part)
    .map((part, index, all) => (index < all.length - 1 && !/[.!?]$/.test(part) ? `${part}.` : part))
    .join(' ')

const speak = (channel: Ref<string>, texts: string[]) => {
  if (!texts.length) return
  channel.value = ''
  nextTick(() => (channel.value = texts.join(' ')))
}

export const announceToasts = (
  next: ToastEntry[],
  spoken: Map<string, string>,
  politeText: Ref<string>,
  assertiveText: Ref<string>
): void => {
  const polite: string[] = []
  const assertive: string[] = []
  const ids = new Set<string>()
  next.forEach((entry) => {
    ids.add(entry.id)
    const text = sentence([entry.message, entry.description])
    const key = `${entry.severity}|${text}`
    if (spoken.get(entry.id) === key) return
    spoken.set(entry.id, key)
    if (entry.severity === 'danger') assertive.push(text)
    else polite.push(text)
  })
  spoken.forEach((_, id) => {
    if (!ids.has(id)) spoken.delete(id)
  })
  speak(politeText, polite)
  speak(assertiveText, assertive)
}
