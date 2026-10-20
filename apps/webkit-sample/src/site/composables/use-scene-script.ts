import { onScopeDispose, readonly, type Ref, ref, watch } from 'vue'

export type SceneWait = (ms: number) => Promise<void>

export interface SceneScriptOptions {
  /** Puts the scene back to its first frame before every pass. */
  reset: () => void
  /** Draws the finished frame, for reduced motion. */
  settle: () => void
  /** One pass of the script; await `wait` between beats. */
  play: (wait: SceneWait) => Promise<void>
  /** Milliseconds the last frame holds before the pass starts over. */
  hold?: number
  /** Milliseconds between the reset frame and the first beat. */
  lead?: number
  /** Whether the scene is the one showing, for scenes that share a frame; on screen alone plays when omitted. */
  active?: () => boolean
}

export interface UseSceneScriptReturn {
  playing: Readonly<Ref<boolean>>
}

class Cancelled extends Error {}

export function useSceneScript(
  target: Ref<Element | null>,
  { reset, settle, play, hold = 3200, lead = 600, active = () => true }: SceneScriptOptions
): UseSceneScriptReturn {
  const playing = ref(false)
  let run = 0
  const timers = new Set<ReturnType<typeof globalThis.setTimeout>>()

  const stop = () => {
    run += 1
    for (const timer of timers) globalThis.clearTimeout(timer)
    timers.clear()
    playing.value = false
  }

  const loop = async () => {
    const token = ++run
    const wait: SceneWait = (ms) =>
      new Promise((resolve, reject) => {
        if (token !== run) return reject(new Cancelled())
        const timer = globalThis.setTimeout(() => {
          timers.delete(timer)
          if (token === run) resolve()
          else reject(new Cancelled())
        }, ms)
        timers.add(timer)
      })

    playing.value = true
    try {
      for (;;) {
        reset()
        await wait(lead)
        await play(wait)
        await wait(hold)
      }
    } catch (error) {
      if (!(error instanceof Cancelled)) throw error
    }
  }

  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')
  let observer: globalThis.IntersectionObserver | null = null

  const onScreen = ref(false)

  const start = () => {
    if (reduced?.matches) {
      stop()
      settle()
      return
    }
    const showing = onScreen.value && active()
    if (showing && !playing.value) loop()
    if (!showing && playing.value) stop()
  }

  watch(active, start)

  watch(
    target,
    (element) => {
      observer?.disconnect()
      if (!element) return
      observer = new globalThis.IntersectionObserver(
        ([entry]) => {
          onScreen.value = Boolean(entry?.isIntersecting)
          start()
        },
        { threshold: 0.35 }
      )
      observer.observe(element)
    },
    { immediate: true }
  )

  settle()

  onScopeDispose(() => {
    observer?.disconnect()
    stop()
  })

  return { playing: readonly(playing) }
}

export async function typeInto(
  wait: SceneWait,
  text: string,
  write: (value: string) => void,
  { step = 2, every = 28 }: { step?: number; every?: number } = {}
): Promise<void> {
  for (let end = step; end < text.length + step; end += step) {
    write(text.slice(0, end))
    await wait(every)
  }
  write(text)
}
