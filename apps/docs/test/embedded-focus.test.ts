import assert from 'node:assert/strict'
import { test } from 'node:test'

const { holdEmbeddedFocus } = await import('../src/lib/embedded-focus.ts')

function fakeHost(embedded: boolean) {
  const handlers = new Map<string, () => void>()
  const host = {
    parent: null as unknown,
    addEventListener: (type: string, handler: () => void) => handlers.set(type, handler),
    removeEventListener: (type: string) => handlers.delete(type)
  }
  host.parent = embedded ? {} : host
  return { host, handlers }
}

test('an embedded preview ignores focus calls until the reader interacts with it', () => {
  const { host, handlers } = fakeHost(true)
  let calls = 0
  const target = { focus: () => void calls++ }
  holdEmbeddedFocus(host, target)
  target.focus()
  assert.equal(calls, 0)
  handlers.get('pointerdown')?.()
  target.focus()
  assert.equal(calls, 1)
  assert.equal(handlers.size, 0)
})

test('a frame opened on its own keeps focus calls', () => {
  const { host, handlers } = fakeHost(false)
  let calls = 0
  const target = { focus: () => void calls++ }
  holdEmbeddedFocus(host, target)
  target.focus()
  assert.equal(calls, 1)
  assert.equal(handlers.size, 0)
})
