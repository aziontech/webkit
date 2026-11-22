import {
  computed,
  type ComputedRef,
  nextTick,
  onMounted,
  readonly,
  type Ref,
  ref,
  watch
} from 'vue'

import { animateHeight, layoutHeight, prefersReducedMotion, slideDirectionOf } from '../lib/layout'
import type { CodeBlockLineMotionMode, CodeBlockSlideDirection } from '../presets/transitions'

export interface UseCodeBlockMotionOptions {
  contentEl: Readonly<Ref<HTMLElement | null>>
  animateLines: () => boolean
  value: () => string
  code: () => string | undefined
  indexOf: (value: string) => number
  activeIndex: () => number
  hasTabs: () => boolean
  lineCount: () => number
}

export interface UseCodeBlockMotionReturn {
  ready: Readonly<Ref<boolean>>
  revealed: Readonly<Ref<number>>
  mode: Readonly<Ref<CodeBlockLineMotionMode>>
  enterFrom: ComputedRef<string>
  version: Readonly<Ref<number>>
}

export function useCodeBlockMotion(options: UseCodeBlockMotionOptions): UseCodeBlockMotionReturn {
  const { contentEl } = options
  const slide = ref<CodeBlockSlideDirection>(null)
  const ready = ref(!options.animateLines())
  const revealed = ref(Number.POSITIVE_INFINITY)
  const mode = ref<CodeBlockLineMotionMode>(options.animateLines() ? 'enter' : null)
  const version = ref(0)
  const flush = (): void => void contentEl.value?.offsetHeight

  function run(next: CodeBlockLineMotionMode): void {
    mode.value = next
    ready.value = !next
    if (next)
      void nextTick(() => {
        flush()
        ready.value = true
      })
  }

  onMounted(() => {
    if (options.hasTabs() && options.animateLines()) run('enter')
  })

  watch([options.value, options.code], ([value, code], [previous, previousCode]) => {
    const el = contentEl.value
    if (!previous || !el) return
    const body = (previousCode ?? '').replace(/\n$/, '')
    if (value === previous && (code ?? '').startsWith(body.slice(0, body.lastIndexOf('\n') + 1)))
      return
    slide.value = slideDirectionOf(options.indexOf(previous), options.activeIndex())
    const from = prefersReducedMotion() ? null : layoutHeight(el)
    version.value += 1
    run('swap')
    if (from !== null) void nextTick(() => animateHeight(el, from, flush))
  })

  watch(options.lineCount, (length, previous) => {
    if (mode.value !== 'enter' || !ready.value || length <= previous) return
    revealed.value = previous
    void nextTick(() => {
      flush()
      revealed.value = Number.POSITIVE_INFINITY
    })
  })

  watch(options.animateLines, (enabled) => run(enabled ? 'enter' : null))

  return {
    ready: readonly(ready),
    revealed: readonly(revealed),
    mode: readonly(mode),
    enterFrom: computed(() => (mode.value === 'swap' ? (slide.value ?? 'none') : 'line')),
    version: readonly(version)
  }
}
