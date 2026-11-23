import {
  type MaybeRefOrGetter,
  nextTick,
  readonly,
  type Ref,
  ref,
  shallowRef,
  toValue,
  useId,
  watch
} from 'vue'

export interface UseMarqueeMarkSymbolsReturn {
  /** The hidden drawing that holds one symbol per mark. */
  defsEl: Ref<globalThis.SVGSVGElement | null>
  /** The `0 0 width height` box of each drawn mark, by registry name. */
  viewBoxes: Readonly<Ref<ReadonlyMap<string, string>>>
  /** Whether every drawn mark has been measured. */
  measured: Readonly<Ref<boolean>>
  /** The document id of a mark's symbol. */
  symbolId: (name: string) => string
}

export function useMarqueeMarkSymbols(
  names: MaybeRefOrGetter<string[]>,
  ready: MaybeRefOrGetter<boolean>
): UseMarqueeMarkSymbolsReturn {
  const prefix = useId()
  const defsEl = ref<globalThis.SVGSVGElement | null>(null)
  const viewBoxes = shallowRef<ReadonlyMap<string, string>>(new Map())
  const measured = ref(false)

  const symbolId = (name: string) => `${prefix}-mark-${name.replace(/[^\w-]/g, '_')}`

  const measure = (root: globalThis.SVGSVGElement) => {
    const next = new Map<string, string>()
    for (const name of toValue(names)) {
      const art = root.querySelector<globalThis.SVGSVGElement>(`[id="${symbolId(name)}"] > svg`)
      const box = art?.viewBox.baseVal
      if (box && box.width > 0 && box.height > 0) next.set(name, `0 0 ${box.width} ${box.height}`)
    }
    return next
  }

  watch(
    () => [toValue(ready), [...toValue(names)], defsEl.value] as const,
    async ([isReady]) => {
      measured.value = false
      if (!isReady) return
      await nextTick()
      if (!toValue(ready)) return
      viewBoxes.value = defsEl.value ? measure(defsEl.value) : new Map()
      measured.value = true
    },
    { immediate: true }
  )

  return {
    defsEl,
    viewBoxes: readonly(viewBoxes) as Readonly<Ref<ReadonlyMap<string, string>>>,
    measured: readonly(measured),
    symbolId
  }
}
