import { describe, expect, it } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import type { AiChatMessage } from '../../utils/lib/ai-chat-types'
import { useAiChatVersions } from './index'

const message = (id: string, role: 'user' | 'assistant', content: string): AiChatMessage => ({
  id,
  role,
  parts: [{ type: 'text', content }]
})

const u1 = message('u1', 'user', 'Which plan am I on?')
const a1 = message('a1', 'assistant', 'Business.')
const u2 = message('u2', 'user', 'Which plan is Acme on?')
const a2 = message('a2', 'assistant', 'Acme is on Business.')
const a3 = message('a3', 'assistant', 'The Business plan.')

function setup(start: AiChatMessage[]) {
  const messages = ref<AiChatMessage[]>(start)
  const scope = effectScope()
  const versions = scope.run(() => useAiChatVersions(messages))!
  return { messages, versions, scope }
}

describe('useAiChatVersions', () => {
  it('has no versions until a message is forked and replaced', async () => {
    const { messages, versions } = setup([u1, a1])
    expect(versions.versionsOf(u1)).toBeNull()
    versions.fork(u1)
    expect(versions.versionsOf(u1)).toBeNull()
    messages.value = []
    await nextTick()
    messages.value = [u2, a2]
    await nextTick()
    expect(versions.versionsOf(u2)).toEqual({ count: 2, index: 1 })
  })

  it('returns the whole conversation of the version picked and follows setMessages', async () => {
    const { messages, versions } = setup([u1, a1])
    versions.fork(u1)
    messages.value = [u2, a2]
    await nextTick()
    const earlier = versions.select(u2, 0)
    expect(earlier?.map((entry) => entry.id)).toEqual(['u1', 'a1'])
    messages.value = earlier!
    await nextTick()
    expect(versions.versionsOf(u1)).toEqual({ count: 2, index: 0 })
    expect(versions.select(u1, 0)).toBeNull()
    expect(versions.select(u1, 1)?.map((entry) => entry.id)).toEqual(['u2', 'a2'])
  })

  it('keeps a regenerated answer as a version after the same prompt', async () => {
    const { messages, versions } = setup([u1, a1])
    versions.fork(a1)
    messages.value = [u1, a3]
    await nextTick()
    expect(versions.versionsOf(a3)).toEqual({ count: 2, index: 1 })
    expect(versions.versionsOf(u1)).toBeNull()
  })

  it('keeps the answers that stream into a version', async () => {
    const { messages, versions } = setup([u1, a1])
    versions.fork(u1)
    messages.value = [u2]
    await nextTick()
    messages.value.push(a2)
    await nextTick()
    expect(versions.select(u2, 0)?.map((entry) => entry.id)).toEqual(['u1', 'a1'])
    messages.value = [u1, a1]
    await nextTick()
    expect(versions.select(u1, 1)?.map((entry) => entry.id)).toEqual(['u2', 'a2'])
  })

  it('hides the versions of a message whose earlier turn changed, and forgets them on clear', async () => {
    const { messages, versions } = setup([u1, a1])
    versions.fork(a1)
    messages.value = [u1, a3]
    await nextTick()
    messages.value = [u2, a3]
    await nextTick()
    expect(versions.versionsOf(a3)).toBeNull()
    messages.value = [u1, a3]
    await nextTick()
    expect(versions.versionsOf(a3)).toEqual({ count: 2, index: 1 })
    versions.clear()
    expect(versions.versionsOf(a3)).toBeNull()
  })

  it('ignores a message that is not in the conversation', () => {
    const { versions } = setup([u1, a1])
    versions.fork(u2)
    expect(versions.versionsOf(u2)).toBeNull()
    expect(versions.select(u2, 0)).toBeNull()
  })

  it('stops following the messages when its scope ends', async () => {
    const { messages, versions, scope } = setup([u1, a1])
    versions.fork(a1)
    scope.stop()
    messages.value = [u1, a3]
    await nextTick()
    expect(versions.versionsOf(a3)).toBeNull()
  })
})
