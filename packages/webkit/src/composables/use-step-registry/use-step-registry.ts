import { computed, type ComputedRef, ref } from 'vue'

export interface StepRegistryHandle {
  /** 1-based position in document order. */
  index: ComputedRef<number>
  /** True while this step is the last one in document order. */
  isLast: ComputedRef<boolean>
}

export interface UseStepRegistryReturn {
  /** Registers a step and returns its reactive handle. */
  register: (id: symbol) => StepRegistryHandle
  /** Hands the step's root element over once mounted, so order is read from the DOM. */
  attach: (id: symbol, el: HTMLElement | null) => void
  /** Removes a previously registered step. */
  unregister: (id: symbol) => void
}

export function useStepRegistry(): UseStepRegistryReturn {
  const steps = ref<symbol[]>([])
  const elements = new Map<symbol, HTMLElement>()

  const ordered = computed(() =>
    [...steps.value].sort((a, b) => {
      const left = elements.get(a)
      const right = elements.get(b)
      if (!left || !right) return 0
      const relation = left.compareDocumentPosition(right)
      if (relation & Node.DOCUMENT_POSITION_FOLLOWING) return -1
      if (relation & Node.DOCUMENT_POSITION_PRECEDING) return 1
      return 0
    })
  )

  const register = (id: symbol): StepRegistryHandle => {
    steps.value.push(id)
    return {
      index: computed(() => ordered.value.indexOf(id) + 1),
      isLast: computed(() => ordered.value.indexOf(id) === ordered.value.length - 1)
    }
  }

  const attach = (id: symbol, el: HTMLElement | null) => {
    if (el) elements.set(id, el)
    else elements.delete(id)
    steps.value = [...steps.value]
  }

  const unregister = (id: symbol) => {
    elements.delete(id)
    const at = steps.value.indexOf(id)
    if (at !== -1) steps.value.splice(at, 1)
  }

  return { register, attach, unregister }
}
