import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue, watch } from 'vue'

import { useMediaQuery } from '../../../../composables/use-media-query'

export type SceneWait = (ms: number) => Promise<void>

export interface SceneScriptOptions {
  reset: () => void
  settle: () => void
  play: (wait: SceneWait) => Promise<void>
  hold?: number
  lead?: number
  active?: () => boolean
  paused?: () => boolean | undefined
}

export interface UseSceneScriptReturn {
  playing: Readonly<Ref<boolean>>
}

class Cancelled extends Error {}

const sceneWait =
  (current: () => boolean, timers: Set<ReturnType<typeof globalThis.setTimeout>>): SceneWait =>
  (ms) =>
    new Promise((resolve, reject) => {
      if (!current()) return reject(new Cancelled())
      const timer = globalThis.setTimeout(() => {
        timers.delete(timer)
        if (current()) resolve()
        else reject(new Cancelled())
      }, ms)
      timers.add(timer)
    })

const playForever = async (
  wait: SceneWait,
  reset: () => void,
  play: (wait: SceneWait) => Promise<void>,
  lead: number,
  hold: number
): Promise<void> => {
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

const watchOnScreen = (
  target: MaybeRefOrGetter<Element | null>,
  onChange: (onScreen: boolean) => void
): (() => void) => {
  let observer: globalThis.IntersectionObserver | null = null
  watch(
    () => toValue(target),
    (element) => {
      observer?.disconnect()
      if (!element) return
      observer = new globalThis.IntersectionObserver(
        ([entry]) => onChange(Boolean(entry?.isIntersecting)),
        { threshold: 0.35 }
      )
      observer.observe(element)
    },
    { immediate: true }
  )
  return () => observer?.disconnect()
}

export function useSceneScript(
  target: MaybeRefOrGetter<Element | null>,
  {
    reset,
    settle,
    play,
    hold = 3200,
    lead = 600,
    active = () => true,
    paused = () => undefined
  }: SceneScriptOptions
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

  const loop = () => {
    const token = ++run
    const wait = sceneWait(() => token === run, timers)
    playing.value = true
    return playForever(wait, reset, play, lead, hold)
  }

  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const onScreen = ref(false)
  const halted = () => paused() ?? reduced.value

  const start = () => {
    if (halted()) {
      stop()
      settle()
      return
    }
    const showing = onScreen.value && active()
    if (showing && !playing.value) loop()
    if (!showing && playing.value) stop()
  }

  watch(active, start)
  watch(halted, start)

  const disconnect = watchOnScreen(target, (on) => {
    onScreen.value = on
    start()
  })

  settle()

  onScopeDispose(() => {
    disconnect()
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
