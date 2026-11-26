import { computed, type ComputedRef, type Ref, ref, shallowRef } from 'vue'

export interface UseCommandPagesReturn {
  page: ComputedRef<string>
  pageHeading: ComputedRef<string>
  pushPage: (name: string) => void
  popPage: () => boolean
  registerPage: (name: string, heading: Ref<string>) => () => void
  resetPages: () => void
}

export function useCommandPages(
  pageModel: Ref<string>,
  goToPage: (name: string) => void
): UseCommandPagesReturn {
  const pageStack = ref<string[]>([])
  const pageHeadings = shallowRef(new Map<string, Ref<string>>())

  return {
    page: computed(() => pageModel.value),
    pageHeading: computed(() => pageHeadings.value.get(pageModel.value)?.value || pageModel.value),
    pushPage: (name) => {
      if (!name || name === pageModel.value) return
      pageStack.value = [...pageStack.value, pageModel.value]
      goToPage(name)
    },
    popPage: () => {
      if (pageModel.value === '') return false
      const stack = [...pageStack.value]
      const previous = stack.pop() ?? ''
      pageStack.value = stack
      goToPage(previous)
      return true
    },
    registerPage: (name, heading) => {
      const next = new Map(pageHeadings.value)
      next.set(name, heading)
      pageHeadings.value = next
      return () => {
        const rest = new Map(pageHeadings.value)
        if (rest.get(name) === heading) rest.delete(name)
        pageHeadings.value = rest
      }
    },
    resetPages: () => {
      pageStack.value = []
    }
  }
}
