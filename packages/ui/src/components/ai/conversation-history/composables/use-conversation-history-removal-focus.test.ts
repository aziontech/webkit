import { describe, expect, it } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { useConversationHistoryRemovalFocus } from './use-conversation-history-removal-focus'

const row = (id: string) => {
  const li = document.createElement('li')
  const button = document.createElement('button')
  button.dataset.slot = 'conversation-history-item'
  button.textContent = id
  const remove = document.createElement('button')
  li.append(button, remove)
  return { li, remove }
}

describe('useConversationHistoryRemovalFocus', () => {
  it('focuses the row that takes the place of a removed one', async () => {
    const nav = document.createElement('nav')
    const rows = ['a', 'b', 'c'].map(row)
    nav.append(...rows.map((r) => r.li))
    document.body.append(nav)
    const ids = ref(['a', 'b', 'c'])
    const scope = effectScope()
    const { track } = scope.run(() => useConversationHistoryRemovalFocus(ref(nav), ids))!
    rows[1]!.remove.focus()
    track({ target: rows[1]!.remove } as unknown as Event, 'b')
    rows[1]!.li.remove()
    ids.value = ['a', 'c']
    await nextTick()
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(document.activeElement?.textContent).toBe('c')
    scope.stop()
    nav.remove()
  })
})
