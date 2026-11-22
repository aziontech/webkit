import { readonly, type Ref, ref } from 'vue'

export interface Timer {
  schedule: (run: () => void, ms: number) => void
  clear: () => void
}

export function createTimer(): Timer {
  let id: ReturnType<typeof globalThis.setTimeout> | null = null
  const clear = (): void => {
    if (id !== null) globalThis.clearTimeout(id)
    id = null
  }
  const schedule = (run: () => void, ms: number): void => {
    clear()
    id = globalThis.setTimeout(() => {
      id = null
      run()
    }, ms)
  }
  return { schedule, clear }
}

export interface TipAnchor {
  left: Readonly<Ref<number>>
  top: Readonly<Ref<number>>
  anchor: (chip: HTMLElement) => void
}

export function createTipAnchor(): TipAnchor {
  const left = ref(0)
  const top = ref(0)
  const anchor = (chip: HTMLElement): void => {
    const rect = chip.getBoundingClientRect()
    left.value = rect.left + rect.width / 2
    top.value = rect.top
  }
  return { left: readonly(left), top: readonly(top), anchor }
}
