type Task = () => Promise<unknown> | unknown

const queue: Task[] = []
let running = false

function nextIdle(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof globalThis.requestIdleCallback === 'function')
      globalThis.requestIdleCallback(() => resolve(), { timeout: 300 })
    else globalThis.setTimeout(resolve, 16)
  })
}

async function drain() {
  if (running) return
  running = true
  try {
    while (queue.length) {
      await nextIdle()
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
  queue.push(task)
  void drain()
  return () => {
    const index = queue.indexOf(task)
    if (index >= 0) queue.splice(index, 1)
  }
}
