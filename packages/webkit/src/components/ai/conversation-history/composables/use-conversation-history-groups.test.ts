import { describe, expect, it } from 'vitest'
import { effectScope } from 'vue'

import { groupOf, useConversationHistoryGroups } from './use-conversation-history-groups'

const today = new Date('2026-11-11T00:00:00').getTime()

describe('useConversationHistoryGroups', () => {
  it('puts a time in its calendar-day group', () => {
    expect(groupOf(new Date('2026-11-11T08:00:00').getTime(), today)).toBe('today')
    expect(groupOf(new Date('2026-11-10T23:30:00').getTime(), today)).toBe('yesterday')
    expect(groupOf(new Date('2026-11-06T10:00:00').getTime(), today)).toBe('previous7')
    expect(groupOf(new Date('2026-10-20T10:00:00').getTime(), today)).toBe('previous30')
    expect(groupOf(new Date('2026-01-01T10:00:00').getTime(), today)).toBe('older')
  })

  it('returns only the groups that hold items, newest first inside each', () => {
    const scope = effectScope()
    const { groups } = scope.run(() =>
      useConversationHistoryGroups(
        [
          { id: 'a', title: 'A', updatedAt: '2026-11-11T08:00:00' },
          { id: 'b', title: 'B', updatedAt: '2026-11-11T12:00:00' },
          { id: 'c', title: 'C', updatedAt: '2026-01-01T10:00:00' }
        ],
        '2026-11-11T15:00:00'
      )
    )!
    expect(groups.value.map((group) => group.key)).toEqual(['today', 'older'])
    expect(groups.value[0]!.chunks[0]!.items.map((item) => item.id)).toEqual(['b', 'a'])
    scope.stop()
  })
})
