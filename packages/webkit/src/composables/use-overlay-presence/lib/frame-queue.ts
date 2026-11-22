export interface FrameQueue {
  afterFrames: (count: number, callback: () => void) => void
  dispose: () => void
}

export function createFrameQueue(): FrameQueue {
  const frames = new Set<number>()
  let disposed = false

  const requestFrame = (callback: () => void) => {
    if (disposed) return
    const id = globalThis.requestAnimationFrame(() => {
      frames.delete(id)
      if (disposed) return
      callback()
    })
    frames.add(id)
  }

  const afterFrames = (count: number, callback: () => void) => {
    requestFrame(count > 1 ? () => afterFrames(count - 1, callback) : callback)
  }

  const dispose = () => {
    disposed = true
    for (const id of frames) globalThis.cancelAnimationFrame(id)
    frames.clear()
  }

  return { afterFrames, dispose }
}

export interface Delay {
  start: (ms: number, callback: () => void) => void
  clear: () => void
}

export function createDelay(): Delay {
  let timer: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (!timer) return
    clearTimeout(timer)
    timer = undefined
  }

  const start = (ms: number, callback: () => void) => {
    clear()
    timer = setTimeout(() => {
      timer = undefined
      callback()
    }, ms)
  }

  return { start, clear }
}
