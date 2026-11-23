import assert from 'node:assert/strict'
import { test } from 'node:test'

const handlers = new Map<string, () => void>()
Object.assign(globalThis, {
  addEventListener: (type: string, handler: () => void) => handlers.set(type, handler)
})

const { SCROLL_QUIET_MS, scheduleMount } = await import('../src/lib/mount-queue.ts')

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

test('a preview mount waits until scrolling has been quiet', async () => {
  let mountedAt = 0
  const done = new Promise<void>((resolve) => {
    scheduleMount(() => {
      mountedAt = performance.now()
      resolve()
    })
  })
  assert.ok(handlers.has('scroll') && handlers.has('wheel') && handlers.has('touchmove'))
  let lastScroll = 0
  for (let step = 0; step < 8; step++) {
    handlers.get(step % 2 ? 'wheel' : 'scroll')?.()
    lastScroll = performance.now()
    assert.equal(mountedAt, 0, `mounted during the scroll, at step ${step}`)
    await sleep(40)
  }
  await done
  assert.ok(mountedAt - lastScroll >= SCROLL_QUIET_MS - 5, `${mountedAt - lastScroll} ms`)
})

test('without scrolling, mounts run one after another', async () => {
  const order: number[] = []
  await Promise.all(
    [1, 2, 3].map(
      (value) =>
        new Promise<void>((resolve) =>
          scheduleMount(() => {
            order.push(value)
            resolve()
          })
        )
    )
  )
  assert.deepEqual(order, [1, 2, 3])
})

test('a cancelled mount never runs', async () => {
  let ran = false
  const cancel = scheduleMount(() => {
    ran = true
  })
  cancel()
  await new Promise<void>((resolve) => scheduleMount(() => resolve()))
  assert.equal(ran, false)
})
