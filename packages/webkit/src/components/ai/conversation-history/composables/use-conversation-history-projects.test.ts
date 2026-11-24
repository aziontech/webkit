import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import type { ConversationHistoryProjectSort } from '../conversation-history.vue'
import { useConversationHistoryProjects } from './use-conversation-history-projects'

const projects = [
  { id: 'p1', title: 'storefront' },
  { id: 'p2', title: 'Acme docs' },
  { id: 'p3', title: 'Billing' }
]
const items = [
  { id: 'a', title: 'Storefront errors', updatedAt: '2026-11-11T13:00:00', projectId: 'p1' },
  { id: 'b', title: 'Storefront cache', updatedAt: '2026-11-08T10:00:00', projectId: 'p1' },
  { id: 'c', title: 'Docs redirects', updatedAt: '2026-11-11T14:00:00', projectId: 'p2' },
  { id: 'd', title: 'Purge the cache', updatedAt: '2026-11-11T12:00:00' },
  { id: 'e', title: 'Orphan', updatedAt: '2026-11-11T11:00:00', projectId: 'gone' }
]

describe('useConversationHistoryProjects', () => {
  it('files chats under their projects, newest first, and keeps the rest outside', () => {
    const { rows, outside } = useConversationHistoryProjects({
      items,
      projects,
      query: '',
      locale: 'en-US',
      sort: 'recent'
    })
    expect(rows.value.map((row) => row.project.id)).toEqual(['p2', 'p1', 'p3'])
    expect(rows.value[1]!.items.map((item) => item.id)).toEqual(['a', 'b'])
    expect(rows.value[2]!.items).toEqual([])
    expect(outside.value.map((item) => item.id)).toEqual(['d', 'e'])
  })

  it('sorts by name in the locale and follows the sort ref', () => {
    const sort = ref<ConversationHistoryProjectSort>('recent')
    const { rows } = useConversationHistoryProjects({
      items,
      projects,
      query: '',
      locale: 'en-US',
      sort
    })
    sort.value = 'name'
    expect(rows.value.map((row) => row.project.title)).toEqual([
      'Acme docs',
      'Billing',
      'storefront'
    ])
  })

  it('keeps only matching chats and the projects that hold one while searching', () => {
    const query = ref('cache')
    const { rows, outside, hasMatch } = useConversationHistoryProjects({
      items,
      projects,
      query,
      locale: 'en-US',
      sort: 'recent'
    })
    expect(rows.value.map((row) => row.project.id)).toEqual(['p1'])
    expect(rows.value[0]!.items.map((item) => item.id)).toEqual(['b'])
    expect(outside.value.map((item) => item.id)).toEqual(['d'])
    query.value = 'zzz'
    expect(hasMatch.value).toBe(false)
  })
})
