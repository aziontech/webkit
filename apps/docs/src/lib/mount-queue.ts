type Task = () => Promise<unknown> | unknown

export const SCROLL_QUIET_MS = 150

const queue: Task[] = []
let running = false
let listening = false
let lastScroll = Number.NEGATIVE_INFINITY

const now = () => globalThis.performance?.now() ?? Date.now()

function onScroll() {
  lastScroll = now()
}

function listen() {
  if (listening || typeof globalThis.addEventListener !== 'function') return
  listening = true
  const options = { capture: true, passive: true }
  for (const type of ['scroll', 'wheel', 'touchmove']) {
    globalThis.addEventListener(type, onScroll, options)
  }
}

function nextIdle(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof globalThis.requestIdleCallback === 'function')
      globalThis.requestIdleCallback(() => resolve(), { timeout: 300 })
    else globalThis.setTimeout(resolve, 16)
  })
}

function quietFor(): number {
  return lastScroll + SCROLL_QUIET_MS - now()
}

async function nextSlot(): Promise<void> {
  for (;;) {
    for (let wait = quietFor(); wait > 0; wait = quietFor()) {
      await new Promise((resolve) => globalThis.setTimeout(resolve, wait))
    }
    await nextIdle()
    if (quietFor() <= 0) return
  }
}

async function drain() {
  if (running) return
  running = true
  try {
    while (queue.length) {
      await nextSlot()
      const task = queue.shift()
      if (!task) continue
      try {
        await task()
      } catch (error) {
        globalThis.console?.error(error)
      }
    }
  } finally {
    running = false
  }
}

export function scheduleMount(task: Task): () => void {
  listen()
  queue.push(task)
  void drain()
  return () => {
    const index = queue.indexOf(task)
    if (index >= 0) queue.splice(index, 1)
  }
}
