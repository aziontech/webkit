import { describe, expect, it, vi } from 'vitest'
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

  it('starts each day at the local midnight of the time zone, across offsets and clock changes', () => {
    const at = (iso: string): number => Date.parse(iso)
    const kathmandu = at('2026-11-11T12:00:00Z')
    expect(groupOf(at('2026-11-10T18:15:00Z'), kathmandu, 'Asia/Kathmandu')).toBe('today')
    expect(groupOf(at('2026-11-10T18:14:00Z'), kathmandu, 'Asia/Kathmandu')).toBe('yesterday')
    const newYork = at('2026-11-02T15:00:00Z')
    expect(groupOf(at('2026-11-02T05:00:00Z'), newYork, 'America/New_York')).toBe('today')
    expect(groupOf(at('2026-11-02T04:59:00Z'), newYork, 'America/New_York')).toBe('yesterday')
    expect(groupOf(at('2026-11-01T04:00:00Z'), newYork, 'America/New_York')).toBe('yesterday')
    expect(groupOf(at('2026-11-01T03:59:00Z'), newYork, 'America/New_York')).toBe('previous7')
    expect(groupOf(at('2026-11-30T09:00:00Z'), newYork, 'America/New_York')).toBe('today')
  })

  it('finds the day starts of a day and zone once and shares them across lists', () => {
    const day = Date.parse('2026-08-14T12:00:00Z')
    const original = Object.getOwnPropertyDescriptor(Intl.DateTimeFormat.prototype, 'format')!
    let calls = 0
    const spy = vi
      .spyOn(Intl.DateTimeFormat.prototype, 'format', 'get')
      .mockImplementation(function (this: Intl.DateTimeFormat) {
        calls += 1
        return original.get!.call(this)
      })
    groupOf(day - 3_600_000, day, 'Europe/Lisbon')
    const first = calls
    calls = 0
    groupOf(day - 7_200_000, day + 60_000, 'Europe/Lisbon')
    spy.mockRestore()
    expect(first).toBeGreaterThan(8)
    expect(calls).toBe(1)
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

  it('splits by status: running first, then the rest with the archived chats', () => {
    const scope = effectScope()
    const { groups } = scope.run(() =>
      useConversationHistoryGroups(
        [
          { id: 'a', title: 'A', updatedAt: '2026-11-11T08:00:00', status: 'running' },
          { id: 'b', title: 'B', updatedAt: '2026-11-11T12:00:00', status: 'success' },
          { id: 'c', title: 'C', updatedAt: '2026-01-01T10:00:00' }
        ],
        '2026-11-11T15:00:00',
        'status',
        [
          {
            id: 'd',
            title: 'D',
            updatedAt: '2026-11-10T10:00:00',
            archived: true,
            status: 'running'
          }
        ]
      )
    )!
    expect(groups.value.map((group) => [group.key, group.count])).toEqual([
      ['working', 1],
      ['settled', 3]
    ])
    expect(groups.value[1]!.chunks[0]!.items.map((item) => item.id)).toEqual(['b', 'd', 'c'])
    scope.stop()
  })
})
